'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowRight } from "lucide-react"

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  kraPin: z.string().regex(/^[A-Z]\d{9}[A-Z]$/, { message: "Invalid KRA PIN format (e.g., A123456789B)." }),
  phoneNumber: z.string().min(10, { message: "Phone number seems too short." }),
  hasBusiness: z.boolean().default(false),
  businessName: z.string().optional(),
  monthlyTurnover: z.coerce.number().optional(),
  businessType: z.string().optional(),
}).refine(data => {
    if (data.hasBusiness) {
        return !!data.businessName && !!data.monthlyTurnover && !!data.businessType;
    }
    return true;
}, {
    message: "Business details are required.",
    path: ["businessName"],
});


export default function DetailsPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      kraPin: "",
      phoneNumber: "",
      hasBusiness: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    router.push('/dashboard');
  }

  const hasBusiness = form.watch("hasBusiness");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Step 3: Tell Us About Yourself &amp; Your Business</CardTitle>
        <CardDescription>
          Finally, please provide some personal and business details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="kraPin"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>KRA PIN / SSN</FormLabel>
                    <FormControl>
                        <Input placeholder="A001234567Z" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                        <Input placeholder="+254 712 345 678" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Business Information</h3>
                <FormField
                    control={form.control}
                    name="hasBusiness"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Do you own a business?</FormLabel>
                                <FormDescription>
                                    Select this if the loan is for business purposes.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {hasBusiness && (
                    <div className="space-y-4 p-4 border rounded-lg animate-in fade-in-50">
                        <FormField
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Business Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Jane's Creations" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="monthlyTurnover"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Monthly Average Turnover (KES)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="50000" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="businessType"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Business Type</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Retail, Services, Agriculture" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-8">
                <Button type="submit" size="lg">
                    Submit Application for Review <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
