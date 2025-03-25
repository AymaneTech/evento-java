import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { BookingType, type Event } from "../../../types/event.types";
import { useCategoryStore } from "../../../store/category.store";
import type { Category } from "../../../types/category.types";
import { Image, Upload } from "lucide-react";
import { useUserInfo } from "../../../types/user-info";
import { EventFormValues, eventSchema } from "../../../validation/event.validation";


interface EventFormProps {
  onSubmit: (data: EventFormValues) => void
  initialData?: Event
  isSubmitting: boolean
  currentUserId?: number
}

export const EventForm: React.FC<EventFormProps> = ({ onSubmit, initialData, isSubmitting, currentUserId }) => {
  const { categories, fetchAllCategories, isLoading: categoriesLoading } = useCategoryStore()
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const { id: userIdFromHook } = useUserInfo()
  const userId = currentUserId || Number(userIdFromHook)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true)
      await fetchAllCategories()
      setIsLoadingCategories(false)
    }
    loadCategories()
  }, [fetchAllCategories])

  useEffect(() => {
    if (initialData?.imageUrl) {
      setPreviewUrl(initialData.imageUrl)
    }
  }, [initialData])

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData
      ? {
        title: initialData.title,
        description: initialData.description,
        numberOfSeats: initialData.numberOfSeats,
        price: initialData.price,
        date: new Date(initialData.date).toISOString().slice(0, 16),
        location: initialData.location,
        bookingType: initialData.bookingType,
        categoryId: initialData.category.id,
        userId: userId,
      }
      : {
        title: "",
        description: "",
        numberOfSeats: 1,
        price: 0,
        date: new Date().toISOString().slice(0, 16),
        location: "",
        bookingType: BookingType.AUTOMATIC,
        categoryId: 0,
        userId: userId,
      },
  })

  const handleSubmit = (data: EventFormValues) => {
    const formattedData = {
      ...data,
      numberOfSeats: Number(data.numberOfSeats),
      price: Number(data.price),
      categoryId: Number(data.categoryId),
      userId: Number(data.userId),
    }
    onSubmit(formattedData)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("image", file, { shouldValidate: true })

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Event description" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numberOfSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Seats</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Number of seats"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value) || "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Price"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date and Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Event location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bookingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select booking type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={BookingType.AUTOMATIC}>Automatic</SelectItem>
                        <SelectItem value={BookingType.MANUAL}>Manual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                      disabled={isLoadingCategories || categoriesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category: Category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Event Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center space-y-4">
                      {/* Image preview */}
                      <div className="border rounded-md w-full aspect-video flex items-center justify-center bg-muted overflow-hidden">
                        {previewUrl ? (
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Event preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
                            <Image className="h-10 w-10 mb-2" />
                            <p>No image selected</p>
                          </div>
                        )}
                      </div>

                      {/* Hidden file input */}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />

                      {/* Custom upload button */}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {initialData ? "Change Image" : "Upload Image"}
                      </Button>

                      {/* Help text */}
                      <p className="text-xs text-muted-foreground">Supported formats: JPEG, PNG, GIF. Max size: 5MB</p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-6">
          {isSubmitting ? "Saving..." : initialData ? "Update Event" : "Create Event"}
        </Button>
      </form>
    </Form>
  )
}

