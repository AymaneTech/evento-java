import { useEffect, useState } from "react"
import { Pencil, Trash2, Loader2, Shield, UserCog, Ban, CheckCircle } from "lucide-react"
import { useUserStore } from "../../../store/user.store"
import { useRoleStore } from "../../../store/role.store"
import { UserStatus } from "../../../types/user.types"
import { Button } from "../../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog"
import { useToast } from "../../../hooks/use-toast"
import { Badge } from "../../../components/ui/badge"
import type { UpdateUserRequestDto } from "../../../types/user.types"
import { UserForm } from "./user-form"

export default function UsersList() {
  const { toast } = useToast()
  const { users, isLoading, error, fetchAllUsers, updateUser, deleteUser, setSelectedUser, selectedUser, clearError } =
    useUserStore()

  const { fetchAllRoles } = useRoleStore()

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchAllUsers()
    fetchAllRoles()
  }, [fetchAllUsers, fetchAllRoles])

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      })
      clearError()
    }
  }, [error, toast, clearError])

  const handleUpdateUser = async (data: UpdateUserRequestDto) => {
    if (!selectedUser) return

    setIsSubmitting(true)
    try {
      await updateUser(selectedUser.id, data)
      setIsEditDialogOpen(false)
      toast({
        title: "Success",
        description: "User updated successfully",
      })
    } catch (error) {
      console.error("Update error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    setIsSubmitting(true)
    try {
      await deleteUser(selectedUser.id)
      setIsDeleteDialogOpen(false)
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch (error) {
      console.error("Delete error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (user: (typeof users)[0]) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: (typeof users)[0]) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const getUserStatusBadge = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> Active
          </Badge>
        )
      case UserStatus.INACTIVE:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Inactive
          </Badge>
        )
      case UserStatus.SUSPENDED:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Ban className="mr-1 h-3 w-3" /> Suspended
          </Badge>
        )
      case UserStatus.DELETED:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Deleted
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleBadge = (roleName: string) => {
    if (roleName.includes("ADMIN")) {
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Shield className="mr-1 h-3 w-3" /> Admin
        </Badge>
      )
    } else if (roleName.includes("ORGANIZER")) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <UserCog className="mr-1 h-3 w-3" /> Organizer
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          User
        </Badge>
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      {isLoading && !users.length ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell className="font-medium">{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                    <TableCell>{getRoleBadge(user.role.name)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(user)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => openDeleteDialog(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and role.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm onSubmit={handleUpdateUser} initialData={selectedUser} isSubmitting={isSubmitting} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              {selectedUser && ` "${selectedUser.firstName} ${selectedUser.lastName}"`} and remove their data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


