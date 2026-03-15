import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/lib/appContext';
import useOrder from '@/lib/hooks/useOrder';
import { toast } from 'sonner';
import { X } from 'lucide-react';

const formSchema = z.object({
	paymentMethod: z.enum(['credit_card', 'paypal', 'bank_transfer'], {
		required_error: 'Please select a payment method.',
	}),
});

export default function CheckoutPage() {
	const { cart, removeFromCart } = useAppContext();
	const { makeOrderMutation } = useOrder();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			paymentMethod: 'credit_card',
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		const orderPayload = {
			orderItems: cart.map((item) => ({
				productId: item.id,
				productVariantId: item.variant.id,
				quantity: item.quantity,
				unitPrice: item.price,
			})),
			paymentMethod: values.paymentMethod,
		};

		if (cart.length > 0) makeOrderMutation.mutate(orderPayload);
		else {
			toast.info(
				'Order item cannot be empty, please select an item to place an order.'
			);
		}
	}

	const totalAmount = cart.reduce(
		(total, item) => total + item.quantity * item.price,
		0
	);

	return (
		<div className='container mx-auto px-4 py-8 flex-1 lg:w-[120rem]'>
			<h1 className='text-3xl font-bold mb-6'>Checkout</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle>Order Summary</CardTitle>
						<CardDescription>
							Review your items and place your order
						</CardDescription>
					</CardHeader>
					<CardContent>
						{cart.map((item) => (
							<div
								key={item?.id}
								className='flex justify-between items-center mb-4'
							>
								<div>
									<h3 className='font-semibold'>{item.name}</h3>
									<p className='text-sm text-gray-500'>
										{item?.variant?.size}, {item?.variant?.color}
									</p>
									<p className='text-sm'>Quantity: {item.quantity}</p>
								</div>
								<div className='flex items-center gap-x-2'>
									<p className='font-semibold'>
										${(item.quantity * item.price).toFixed(2)}
									</p>
									<Button
										variant='secondary'
										size='icon'
										onClick={() => removeFromCart(item.id)}
										aria-label={`Remove ${item.name} from cart`}
									>
										<X className='h-4 w-4' />
									</Button>
								</div>
							</div>
						))}
						<Separator className='my-4' />
						<div className='flex justify-between items-center'>
							<h3 className='font-semibold'>Total</h3>
							<p className='font-semibold'>${totalAmount.toFixed(2)}</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Payment Method</CardTitle>
						<CardDescription>
							Select your preferred payment method
						</CardDescription>
					</CardHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<CardContent>
								<FormField
									control={form.control}
									name='paymentMethod'
									render={({ field }) => (
										<FormItem className='space-y-3'>
											<FormControl>
												<RadioGroup
													onValueChange={field.onChange}
													defaultValue={field.value}
													className='flex flex-col space-y-1'
												>
													<FormItem className='flex items-center space-x-3 space-y-0'>
														<FormControl>
															<RadioGroupItem value='credit_card' />
														</FormControl>
														<FormLabel className='font-normal'>
															Credit Card
														</FormLabel>
													</FormItem>
													<FormItem className='flex items-center space-x-3 space-y-0'>
														<FormControl>
															<RadioGroupItem value='paypal' />
														</FormControl>
														<FormLabel className='font-normal'>
															PayPal
														</FormLabel>
													</FormItem>
													<FormItem className='flex items-center space-x-3 space-y-0'>
														<FormControl>
															<RadioGroupItem value='bank_transfer' />
														</FormControl>
														<FormLabel className='font-normal'>
															Bank Transfer
														</FormLabel>
													</FormItem>
												</RadioGroup>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
							<CardFooter>
								<Button type='submit' className='w-full'>
									Place Order
								</Button>
							</CardFooter>
						</form>
					</Form>
				</Card>
			</div>
		</div>
	);
}
