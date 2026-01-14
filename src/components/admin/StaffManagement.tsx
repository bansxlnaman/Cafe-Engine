import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, Users, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StaffMember {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'staff';
  created_at: string;
}

const StaffManagement = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'staff'>('staff');
  const [creating, setCreating] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    
    // Get all user roles with profile info
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role, created_at');

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      toast.error('Failed to load staff');
      setLoading(false);
      return;
    }

    // Get profiles for these users
    const userIds = roles?.map(r => r.user_id) || [];
    
    if (userIds.length === 0) {
      setStaff([]);
      setLoading(false);
      return;
    }

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    }

    // Combine data
    const staffList: StaffMember[] = (roles || []).map(role => {
      const profile = profiles?.find(p => p.id === role.user_id);
      return {
        id: role.user_id,
        email: profile?.email || 'Unknown',
        full_name: profile?.full_name || null,
        role: role.role as 'admin' | 'staff',
        created_at: role.created_at,
      };
    });

    setStaff(staffList);
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async () => {
    if (!newEmail.trim()) {
      toast.error('Please enter an email');
      return;
    }

    setCreating(true);

    try {
      // First check if the user exists in profiles
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newEmail.trim())
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!existingProfile) {
        toast.error('User not found. They must sign up first at /auth');
        setCreating(false);
        return;
      }

      // Check if role already exists
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', existingProfile.id)
        .maybeSingle();

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', existingProfile.id);

        if (error) throw error;
        toast.success('Role updated successfully');
      } else {
        // Create new role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: existingProfile.id, role: newRole });

        if (error) throw error;
        toast.success('Staff member added successfully');
      }

      setIsDialogOpen(false);
      setNewEmail('');
      setNewRole('staff');
      fetchStaff();
    } catch (error: any) {
      console.error('Error adding staff:', error);
      toast.error(error.message || 'Failed to add staff member');
    }

    setCreating(false);
  };

  const handleRemoveRole = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this staff member\'s access?')) {
      return;
    }

    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (error) {
      toast.error('Failed to remove staff member');
    } else {
      toast.success('Staff access removed');
      fetchStaff();
    }
  };

  const updateRole = async (userId: string, newRole: 'admin' | 'staff') => {
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('user_id', userId);

    if (error) {
      toast.error('Failed to update role');
    } else {
      toast.success('Role updated');
      fetchStaff();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold">Staff Management</h2>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Add Staff
        </Button>
      </div>

      {/* Staff List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading staff...</p>
        </div>
      ) : staff.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">No Staff Members</p>
          <p className="text-muted-foreground text-sm mb-4">
            Add staff members to give them access to the kitchen display and admin panel.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add Your First Staff
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {staff.map(member => (
            <Card key={member.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {member.role === 'admin' ? (
                      <Shield className="w-5 h-5 text-primary" />
                    ) : (
                      <Users className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {member.full_name || member.email}
                      </span>
                      <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {member.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={member.role}
                    onValueChange={(value: 'admin' | 'staff') => updateRole(member.id, value)}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleRemoveRole(member.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="p-4 bg-muted/50">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Role Permissions</p>
            <ul className="text-muted-foreground space-y-1">
              <li><strong>Admin:</strong> Full access to admin panel, menu management, analytics, and staff management</li>
              <li><strong>Staff:</strong> Access to kitchen display for order management</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Add Staff Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="staff@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The user must have already signed up at /auth before you can add them.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newRole} onValueChange={(v: 'admin' | 'staff') => setNewRole(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff (Kitchen Display Only)</SelectItem>
                  <SelectItem value="admin">Admin (Full Access)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStaff} disabled={creating}>
              {creating ? 'Adding...' : 'Add Staff'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;
