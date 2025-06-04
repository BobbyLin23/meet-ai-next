'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { OctagonAlertIcon } from 'lucide-react'
import { FaGithub, FaGoogle } from 'react-icons/fa'

import { Card, CardContent } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { Alert, AlertTitle } from '@/components/ui/alert'

export default function Page() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const formSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setError('')
    authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          setLoading(false)
        },
        onError: ({ error }) => {
          setError(error.message)
          setLoading(false)
        },
      }
    )
  }

  return (
    <div className="flex flex-col gap-y-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back!</h1>
                  <p className="text-muted-foreground text-balance">
                    Please sign in your account!
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    name="email"
                  />
                  <FormField
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="*******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    name="password"
                  />
                </div>
                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="!text-destructive size-4" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  Sign In
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:left-0 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    <FaGoogle className="mr-2 size-4" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    <FaGithub className="mr-2 size-4" />
                    Github
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?
                  <Link
                    href="/sign-up"
                    className="underline hover:underline-offset-4"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="from-sidebar-accent to-sidebar relative hidden flex-col items-center justify-center gap-y-4 bg-radial md:flex">
            <Image src="/logo.svg" alt="Logo" width={360} height={360} />
            <p className="text-2xl font-semibold text-white">Meet.AI</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
