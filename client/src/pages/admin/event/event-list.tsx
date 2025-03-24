import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, CheckCircle, XCircle, Settings } from "lucide-react"
import { useEventStore } from "../../../store/event.store"
import { type Event, BookingType } from "../../../types/event.types"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { useToast } from "../../../hooks/use-toast"
import { Pagination } from "../../../components/ui/pagination"
import { EventFormValues } from "../../../validation/event.validation.ts";
import { formatCurrency, formatDate } from "../../../lib/formatters.ts";
import { EventForm } from "./event-form.tsx";

export default function EventsList() {
  const { toast } = useToast()
  const {
    events,
    isLoading,
    error,
    pagination,
    fetchAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    setReservationApprovalMode,
    toggleEventValidationStatus,
    clearError,
  } = useEventStore()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const currentUserId = 1 // Replace with actual user ID from auth context

  useEffect(() => {
    fetchAllEvents()
  }, [fetchAllEvents])

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

  const handleCreateEvent = async (data: EventFormValues) => {
    setIsSubmitting(true)
    try {
      await createEvent(data)
      setIsCreateDialogOpen(false)
      toast({
        title: "Success",
        description: "Event created successfully",
      })
    } catch (error) {
      // Error is handled by the store
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateEvent = async (data: EventFormValues) => {
    if (!selectedEvent) return

    setIsSubmitting(true)
    try {
      await updateEvent(selectedEvent.id, data)
      setIsEditDialogOpen(false)
      setSelectedEvent(null)
      toast({
        title: "Success",
        description: "Event updated successfully",
      })
    } catch (error) {
      // Error is handled by the store
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return

    setIsSubmitting(true)
    try {
      await deleteEvent(selectedEvent.id)
      setIsDeleteDialogOpen(false)
      setSelectedEvent(null)
      toast({
        title: "Success",
        description: "Event deleted successfully",
      })
    } catch (error) {
      // Error is handled by the store
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSetBookingType = async (id: number, bookingType: BookingType) => {
    try {
      await setReservationApprovalMode(id, bookingType)
      toast({
        title: "Success",
        description: `Booking type set to ${bookingType}`,
      })
    } catch (error) {
      // Error is handled by the store
    }
  }

  const handleToggleValidation = async (id: number) => {
    try {
      await toggleEventValidationStatus(id)
      toast({
        title: "Success",
        description: "Event validation status toggled",
      })
    } catch (error) {
      // Error is handled by the store
    }
  }

  const openEditDialog = (event: Event) => {
    setSelectedEvent(event)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (event: Event) => {
    setSelectedEvent(event)
    setIsDeleteDialogOpen(true)
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      useEventStore.getState().searchEventsByTitle(searchTerm)
    } else {
      fetchAllEvents()
    }
  }

  const handlePageChange = (page: number) => {
    fetchAllEvents(page, pagination.pageSize)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search events by title..."
            className="w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {isLoading && !events.length ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Booking Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No events found
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{formatDate(event.date)}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{formatCurrency(event.price)}</TableCell>
                    <TableCell>{event.numberOfSeats}</TableCell>
                    <TableCell>{event.category.name}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          event.bookingType === BookingType.AUTOMATIC
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {event.bookingType}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditDialog(event)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleValidation(event.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Toggle Validation
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleSetBookingType(event.id, BookingType.AUTOMATIC)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Set Automatic Booking
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSetBookingType(event.id, BookingType.MANUAL)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Set Manual Booking
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(event)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {events.length > 0 && (
        <Pagination
          currentPage={pagination.pageNumber}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>Add a new event to your event management system.</DialogDescription>
          </DialogHeader>
          <EventForm onSubmit={handleCreateEvent} isSubmitting={isSubmitting} currentUserId={currentUserId} />
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Make changes to the event.</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <EventForm
              onSubmit={handleUpdateEvent}
              initialData={selectedEvent}
              isSubmitting={isSubmitting}
              currentUserId={currentUserId}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Event Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event "{selectedEvent?.title}" and remove
              it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
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


