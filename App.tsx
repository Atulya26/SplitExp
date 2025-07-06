import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { AddExpense } from './components/AddExpense';
import { ExpenseDirectory } from './components/ExpenseDirectory';
import { Balances } from './components/Balances';
import { Settlements } from './components/Settlements';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Calculator, Receipt, Users, TrendingUp, Loader2 } from 'lucide-react';
import { onAuthStateChange, signInAnonymouslyUser } from './src/firebase/auth';
import { createGroup, getGroups, addExpense, deleteExpense, addMember, removeMember, getExpenses, getMembers, Group, Member, Expense } from './src/firebase/firestore';

export default function App() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]); // new
  const [expenses, setExpenses] = useState<Expense[]>([]); // new
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch members and expenses for the active group
  const fetchGroupData = async (group: Group | null) => {
    if (!group) {
      setMembers([]);
      setExpenses([]);
      return;
    }
    try {
      const [groupMembers, groupExpenses] = await Promise.all([
        getMembers(group.id),
        getExpenses(group.id),
      ]);
      setMembers(groupMembers);
      setExpenses(groupExpenses);
    } catch (error) {
      setMembers([]);
      setExpenses([]);
      console.error('Error loading group data:', error);
    }
  };

  // Initialize Firebase auth and load groups
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const userGroups = await getGroups(user.uid);
          setGroups(userGroups);
          if (userGroups.length > 0) {
            setActiveGroup(userGroups[0]);
          }
        } catch (error) {
          console.error('Error loading groups:', error);
        }
      } else {
        // Sign in anonymously if no user
        try {
          const result = await signInAnonymouslyUser();
          setUserId(result.uid);
        } catch (error) {
          console.error('Error signing in anonymously:', error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch members and expenses when activeGroup changes
  useEffect(() => {
    fetchGroupData(activeGroup);
  }, [activeGroup]);

  const handleAddExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!activeGroup || !userId) return;
    try {
      await addExpense(activeGroup.id, expense);
      fetchGroupData(activeGroup);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleAddMember = async (member: Omit<Member, 'id'>) => {
    if (!activeGroup || !userId) return;
    try {
      await addMember(activeGroup.id, member);
      fetchGroupData(activeGroup);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!activeGroup) return;
    try {
      await removeMember(memberId);
      fetchGroupData(activeGroup);
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!activeGroup) return;
    try {
      await deleteExpense(expenseId);
      fetchGroupData(activeGroup);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleSelectGroup = (group: Group | null) => {
    setActiveGroup(group);
  };

  const handleCreateGroup = async (groupData: { name: string; description?: string }) => {
    if (!userId) return;
    try {
      const newGroup = await createGroup({
        name: groupData.name,
        description: groupData.description,
        members: [], // not used in Firestore
        expenses: [], // not used in Firestore
        createdBy: userId
      });
      const updatedGroups = [...groups, newGroup];
      setGroups(updatedGroups);
      setActiveGroup(newGroup);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const getGroupStats = () => {
    if (!activeGroup) return { totalExpenses: 0, memberCount: 0, expenseCount: 0, averageExpense: 0 };
    const totalExpenses = expenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
    const memberCount = members.length;
    const expenseCount = expenses.length;
    const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;
    return { totalExpenses, memberCount, expenseCount, averageExpense };
  };

  const stats = getGroupStats();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!activeGroup) {
    return (
      <div className="h-screen flex">
        <Sidebar 
          groups={groups}
          activeGroup={activeGroup}
          onSelectGroup={handleSelectGroup}
          onCreateGroup={handleCreateGroup}
          userId={userId}
        />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Expense Splitter</h2>
            <p className="text-gray-600 mb-6">Create or select a group to start splitting expenses with your friends.</p>
            <Button onClick={() => {}} className="bg-indigo-600 hover:bg-indigo-700">
              Create Your First Group
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar 
        groups={groups}
        activeGroup={activeGroup}
        onSelectGroup={handleSelectGroup}
        onCreateGroup={handleCreateGroup}
        userId={userId}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{activeGroup.name}</h1>
              {activeGroup.description && (
                <p className="text-gray-600 mt-1">{activeGroup.description}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{stats.totalExpenses.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Members</p>
                    <p className="text-xl font-semibold text-gray-900">{stats.memberCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Receipt className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expenses</p>
                    <p className="text-xl font-semibold text-gray-900">{stats.expenseCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average</p>
                    <p className="text-xl font-semibold text-gray-900">
                      ₹{stats.averageExpense.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <Calculator className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Balance</p>
                    <p className="text-xl font-semibold text-gray-900">Settled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Main Content */}
        <div className="p-8 overflow-y-auto h-[calc(100%-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <AddExpense 
                members={members}
                onAddExpense={handleAddExpense}
              />
              <ExpenseDirectory 
                expenses={expenses}
                members={members}
                onDeleteExpense={handleDeleteExpense}
              />
            </div>
            {/* Right Column */}
            <div className="space-y-6">
              <Balances 
                members={members}
                expenses={expenses}
              />
              <Settlements 
                members={members}
                expenses={expenses}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}