import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useEventStore } from "../../store/event.store"
import { useAuthStore } from "../../store/auth.store"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import { Calendar, MapPin, Users, Clock, User, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { BookingType, type Event } from "../../types/event.types"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { useToast } from "../../hooks/use-toast"
import { formatCurrency, formatDate } from "../../lib/formatters"

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { selectedEvent, isLoading, error, fetchEventById, events, fetchAllEvents } = useEventStore()
  const { isAuthenticated } = useAuthStore()
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([])
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)


  useEffect(() => {
    if (id) {
      fetchEventById(Number.parseInt(id))
    }

    if (events.length === 0) {
      fetchAllEvents()
    }
  }, [id])

  useEffect(() => {
    if (selectedEvent && events.length > 0) {
      const sameCategoryEvents = events
        .filter((event) => event.id !== selectedEvent.id && event.category.id === selectedEvent.category.id)
        .slice(0, 3)

      setRelatedEvents(sameCategoryEvents)
    }
  }, [selectedEvent, events])

  const handleBookEvent = () => {
    toast({
      title: "Booking Initiated",
      description: "The booking functionality will be implemented soon.",
    })
    setIsBookingDialogOpen(false)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate("/events")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
      </div>
    )
  }

  if (!selectedEvent) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Event Not Found</AlertTitle>
          <AlertDescription>The event you're looking for doesn't exist or has been removed.</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate("/events")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/events")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-[2/1] bg-muted rounded-lg overflow-hidden">
            <img
              src={selectedEvent.imageUrl}
              alt={selectedEvent.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-sm font-normal">
                {selectedEvent.category.name}
              </Badge>
              <Badge
                variant="outline"
                className={`text-sm font-normal ${selectedEvent.bookingType === BookingType.AUTOMATIC
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
              >
                {selectedEvent.bookingType === BookingType.AUTOMATIC ? "Automatic Booking" : "Manual Approval"}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold mb-4">{selectedEvent.title}</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Date & Time</span>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{formatDate(selectedEvent.date)}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Location</span>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Available Seats</span>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{selectedEvent.numberOfSeats}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Price</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-lg">{formatCurrency(selectedEvent.price)}</span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h2 className="text-xl font-semibold mb-4">About This Event</h2>
              <p className="whitespace-pre-line">{selectedEvent.description}</p>
            </div>

            <Separator className="my-6" />

            <div>
              <h2 className="text-xl font-semibold mb-4">Organizer</h2>
              <div className="flex items-center gap-4">
                <div className="bg-muted rounded-full p-3">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">{selectedEvent.organiser.firstName} {selectedEvent.organiser.lastName}</p>
                  <p className="text-sm text-muted-foreground">{selectedEvent.organiser.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Price</h3>
                  <p className="text-2xl font-bold">{formatCurrency(selectedEvent.price)}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Date and Time</h3>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p>
                        {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(selectedEvent.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p>{selectedEvent.location}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Booking Type</h3>
                  <p className="text-sm">
                    {selectedEvent.bookingType === BookingType.AUTOMATIC
                      ? "Automatic confirmation upon booking"
                      : "Manual approval required by the organizer"}
                  </p>
                </div>

                <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">Book Now</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book Event Ticket</DialogTitle>
                      <DialogDescription>
                        {isAuthenticated
                          ? "Complete your booking for this event."
                          : "Please log in to book this event."}
                      </DialogDescription>
                    </DialogHeader>

                    {isAuthenticated ? (
                      <>
                        <div className="space-y-4 py-4">
                          <div className="flex justify-between">
                            <span>Event</span>
                            <span className="font-medium">{selectedEvent.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Date</span>
                            <span className="font-medium">{formatDate(selectedEvent.date)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Price</span>
                            <span className="font-medium">{formatCurrency(selectedEvent.price)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span>Total</span>
                            <span className="font-bold">{formatCurrency(selectedEvent.price)}</span>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleBookEvent}>Confirm Booking</Button>
                        </DialogFooter>
                      </>
                    ) : (
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button asChild>
                          <Link to="/login">Log In</Link>
                        </Button>
                      </DialogFooter>
                    )}
                  </DialogContent>
                </Dialog>

                {!isAuthenticated && (
                  <p className="text-sm text-muted-foreground text-center">
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>{" "}
                    to book this event
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Share Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Share This Event</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                  </svg>
                </Button>
                <Button variant="outline" className="flex-1">
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedEvents.map((event) => (
              <Link to={`/events/${event.id}`} key={event.id}>
                <Card className="h-full transition-all hover:shadow-md">
                  <div className="aspect-[2/1] bg-muted overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-1">{event.title}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold">{formatCurrency(event.price)}</span>
                        <Button size="sm">View</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}



