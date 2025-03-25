import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, type EventFormValues } from "../../../validation/event.validation";
import { Button } from "../../../components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { type Event, BookingType } from "../../../types/event.types";
import { useCategoryStore } from "../../../store/category.store";
import type { Category } from "../../../types/category.types";
import { useUserInfo } from "../../../types/user-info.ts";

interface EventFormProps {
  onSubmit: (data: EventFormValues) => void;
  initialData?: Event;
  isSubmitting: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({ onSubmit, initialData, isSubmitting }) => {
  const { categories, fetchAllCategories, isLoading: categoriesLoading } = useCategoryStore();
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const { id: currentUserId } = useUserInfo();

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      await fetchAllCategories();
      setIsLoadingCategories(false);
    };
    loadCategories();
  }, [fetchAllCategories]);

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
        userId: currentUserId
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
        userId: Number(currentUserId),
      },
  });

  const handleSubmit = (data: EventFormValues) => {
    const formattedData = {
      ...data,
      numberOfSeats: Number(data.numberOfSeats),
      price: Number(data.price),
      categoryId: Number(data.categoryId),
      userId: Number(data.userId),
    };
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Event" : "Create Event"}
        </Button>
      </form>
    </Form>
  );
};
