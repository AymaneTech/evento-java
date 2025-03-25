import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { useEventStore } from "../../store/event.store"
import { useCategoryStore } from "../../store/category.store"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Pagination } from "../../components/ui/pagination"
import { Calendar, MapPin, Tag, Search, Filter, Loader2, Users } from 'lucide-react'
import type { Event } from "../../types/event.types"
import type { Category } from "../../types/category.types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "../../components/ui/sheet"
import { Checkbox } from "../../components/ui/checkbox"
import { Label } from "../../components/ui/label"
import { Slider } from "../../components/ui/slider"
import { formatCurrency, formatDate } from "../../lib/formatters"

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { events, isLoading: eventsLoading, pagination, fetchAllEvents, searchEventsByTitle } = useEventStore()
  const { categories, isLoading: categoriesLoading, fetchAllCategories } = useCategoryStore()

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortBy, setSortBy] = useState<string>("date-asc")
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])

  useEffect(() => {
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      setSelectedCategories([Number.parseInt(categoryParam)])
    }
  }, [searchParams])

  useEffect(() => {
    console.log("here here motherfucker");

    fetchAllEvents()
    fetchAllCategories()
  }, [])

  useEffect(() => {
    console.log("lkllelelel");
    let filtered = [...events]

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((event) => selectedCategories.includes(event.category.id))
    }

    filtered = filtered.filter((event) => event.price >= priceRange[0] && event.price <= priceRange[1])

    switch (sortBy) {
      case "date-asc":
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "date-desc":
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    setFilteredEvents(filtered)
  }, [events, selectedCategories, priceRange, sortBy])

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchEventsByTitle(searchTerm)
      setSearchParams({ search: searchTerm })
    } else {
      fetchAllEvents()
      setSearchParams({})
    }
  }

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 1000])
    setSortBy("date-asc")
  }

  const handlePageChange = (page: number) => {
    fetchAllEvents(page, pagination.pageSize)
  }

  // Find max price for slider
  const maxPrice = events.length > 0 ? Math.max(...events.map((event) => event.price)) : 1000

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Events</h1>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full"
            />
          </div>
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-asc">Date (Earliest)</SelectItem>
              <SelectItem value="date-desc">Date (Latest)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {selectedCategories.length > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {selectedCategories.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Events</SheetTitle>
                <SheetDescription>Narrow down events based on your preferences</SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Categories</h3>
                  {categoriesLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {categories.map((category: Category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleCategoryToggle(category.id)}
                          />
                          <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Price Range</h3>
                    <span>
                      {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, maxPrice]}
                    min={0}
                    max={maxPrice}
                    step={1}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="py-4"
                  />
                </div>
              </div>

              <SheetFooter>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <SheetClose asChild>
                  <Button>Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Events Grid */}
      {eventsLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredEvents.map((event) => (
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
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.numberOfSeats} seats available</span>
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
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <div className="mb-4">
            <Search className="h-12 w-12 mx-auto text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No events found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}

      {/* Pagination */}
      {filteredEvents.length > 0 && (
        <Pagination
          currentPage={pagination.pageNumber}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

