import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useEventStore } from "../../store/event.store"
import { useCategoryStore } from "../../store/category.store"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel"
import { Calendar, MapPin, Tag, ArrowRight, Loader2 } from 'lucide-react'
import type { Event } from "../../types/event.types"
import type { Category } from "../../types/category.types"
import { useAuthStore } from "../../store/auth.store"
import { formatCurrency, formatDate } from "../../lib/formatters"

export default function HomePage() {
  const { events, isLoading: eventsLoading, fetchAllEvents } = useEventStore()
  const { categories, isLoading: categoriesLoading, fetchAllCategories } = useCategoryStore()
  const { isAuthenticated } = useAuthStore()
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])

  useEffect(() => {
    fetchAllEvents()
    fetchAllCategories()
  }, [])

  useEffect(() => {
    if (events.length > 0) {
      setFeaturedEvents(events.slice(0, 5))
    }
  }, [events])

  const upcomingEvents = events
    .filter((event) => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Discover Amazing Events Near You</h1>
              <p className="text-lg text-muted-foreground">
                Find and book tickets for concerts, workshops, conferences, and more.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link to="/events">Browse Events</Link>
                </Button>
                {!isAuthenticated && (
                  <Button asChild variant="outline" size="lg">
                    <Link to="/register">Sign Up</Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <img src="/placeholder.svg?height=400&width=600" alt="Events collage" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Carousel */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Events</h2>
            <Button asChild variant="ghost">
              <Link to="/events" className="flex items-center gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {eventsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : featuredEvents.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {featuredEvents.map((event) => (
                  <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                    <Link to={`/events/${event.id}`}>
                      <Card className="h-full transition-all hover:shadow-md">
                        <CardHeader className="p-4">
                          <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                            <img
                              src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(event.title)}`}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span>{event.category.name}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <span className="font-bold">{formatCurrency(event.price)}</span>
                          <Button size="sm">View Details</Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:flex">
                <CarouselPrevious className="left-1" />
                <CarouselNext className="right-1" />
              </div>
            </Carousel>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No featured events available at the moment.</div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>

          {categoriesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category: Category) => (
                <Link to={`/events?category=${category.id}`} key={category.id}>
                  <div className="bg-background rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-center items-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                      <Tag className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{category.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Button asChild variant="ghost">
              <Link to="/events" className="flex items-center gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {eventsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Link to={`/events/${event.id}`} key={event.id}>
                  <Card className="h-full transition-all hover:shadow-md">
                    <div className="aspect-[2/1] bg-muted overflow-hidden">
                      <img
                        src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(event.title)}`}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span>{event.category.name}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <span className="font-bold">{formatCurrency(event.price)}</span>
                      <Button size="sm">View Details</Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No upcoming events available at the moment.</div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Amazing Events?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our community to discover events, connect with organizers, and never miss out on your favorite
            activities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/events">Browse Events</Link>
            </Button>
            {!isAuthenticated && (
              <Button asChild size="lg" variant="outline" className="bg-transparent">
                <Link to="/register">Create Account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

