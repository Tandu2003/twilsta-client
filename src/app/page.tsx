import { ArrowRight, Globe, Heart, MessageCircle, Shield, Star, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  const features = [
    {
      icon: MessageCircle,
      title: 'Instant Connection',
      description: 'Share your thoughts and connect with friends in real time',
    },
    {
      icon: Users,
      title: 'Vibrant Community',
      description: 'Join engaging discussions with millions of users',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Discover content from around the world',
    },
    {
      icon: Zap,
      title: 'High Speed',
      description: 'Smooth experience with modern technology',
    },
    {
      icon: Shield,
      title: 'Absolute Security',
      description: 'Your information is protected with advanced encryption technology',
    },
    {
      icon: Heart,
      title: 'User-Friendly Interface',
      description: 'Intuitive design, easy to use for everyone',
    },
  ];

  const testimonials = [
    {
      name: 'John Smith',
      role: 'Developer',
      content: 'Twilsta helps me connect with the programming community easily.',
      rating: 5,
    },
    {
      name: 'Emily Johnson',
      role: 'Designer',
      content: 'Beautiful interface, rich features. I really enjoy using Twilsta.',
      rating: 5,
    },
    {
      name: 'Michael Brown',
      role: 'Student',
      content: 'A great place to learn and share knowledge with everyone.',
      rating: 5,
    },
  ];

  const stats = [
    { label: 'Active Users', value: '10M+' },
    { label: 'Daily Posts', value: '100K+' },
    { label: 'Countries', value: '190+' },
    { label: 'Response Time', value: '<1s' },
  ];

  return (
    <div className='bg-background min-h-screen'>
      {/* Header */}
      <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur'>
        <div className='container mx-auto px-4'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Image src='/images/logo_02.png' alt='Twilsta' width={120} height={120} />
            </div>

            <nav className='hidden items-center space-x-6 md:flex'>
              <Link
                href='#features'
                className='hover:text-primary text-sm font-medium transition-colors'
              >
                Features
              </Link>
              <Link
                href='#about'
                className='hover:text-primary text-sm font-medium transition-colors'
              >
                About Us
              </Link>
              <Link
                href='#testimonials'
                className='hover:text-primary text-sm font-medium transition-colors'
              >
                Reviews
              </Link>
              <Link
                href='#contact'
                className='hover:text-primary text-sm font-medium transition-colors'
              >
                Contact
              </Link>
            </nav>

            <div className='flex items-center space-x-4'>
              <Button variant='ghost' asChild>
                <Link href='/auth/login'>Sign In</Link>
              </Button>
              <Button asChild>
                <Link href='/auth/register'>Sign Up Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-20 text-center'>
        <div className='container mx-auto max-w-4xl'>
          <h1 className='mb-6 text-4xl font-bold tracking-tight md:text-6xl'>
            Connect, Share, <span className='text-primary'>Discover</span>
          </h1>
          <p className='text-muted-foreground mx-auto mb-8 max-w-2xl text-xl'>
            Join Twilsta - the modern social network where you can share thoughts, connect with
            friends and discover exciting things every day.
          </p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Button size='lg' className='px-8 text-lg' asChild>
              <Link href='/auth/register'>
                Get Started Free
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </Button>
            <Button variant='outline' size='lg' className='px-8 text-lg' asChild>
              <Link href='#features'>Learn More</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className='mt-16 grid grid-cols-2 gap-8 md:grid-cols-4'>
            {stats.map((stat, index) => (
              <div key={index} className='text-center'>
                <div className='text-primary text-3xl font-bold'>{stat.value}</div>
                <div className='text-muted-foreground text-sm'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='px-4 py-20'>
        <div className='container mx-auto max-w-6xl'>
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>Why Choose Twilsta?</h2>
            <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
              Experience social networking with advanced features and high security
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {features.map((feature, index) => (
              <Card key={index} className='border-0 shadow-lg transition-shadow hover:shadow-xl'>
                <CardHeader>
                  <div className='flex items-center space-x-3'>
                    <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
                      <feature.icon className='text-primary h-6 w-6' />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-base'>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id='testimonials' className='bg-muted/30 px-4 py-20'>
        <div className='container mx-auto max-w-6xl'>
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>What Our Users Say</h2>
            <p className='text-muted-foreground text-xl'>
              Millions of people trust and use Twilsta
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            {testimonials.map((testimonial, index) => (
              <Card key={index} className='border-0 shadow-lg'>
                <CardContent className='p-6'>
                  <div className='mb-4 flex items-center'>
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                    ))}
                  </div>
                  <p className='text-muted-foreground mb-4'>"{testimonial.content}"</p>
                  <div className='flex items-center'>
                    <div className='bg-primary/10 mr-3 flex h-10 w-10 items-center justify-center rounded-full'>
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className='font-semibold'>{testimonial.name}</div>
                      <div className='text-muted-foreground text-sm'>{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-primary text-primary-foreground px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>Ready to Get Started?</h2>
          <p className='mb-8 text-xl opacity-90'>
            Join the Twilsta community today and discover a new world
          </p>
          <Button size='lg' variant='secondary' className='px-8 text-lg' asChild>
            <Link href='/auth/register'>
              Create Free Account
              <ArrowRight className='ml-2 h-5 w-5' />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t px-4 py-12'>
        <div className='container mx-auto max-w-6xl'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
            <div>
              <div className='mb-4 flex items-center space-x-2'>
                <Image src='/images/logo_02.png' alt='Twilsta' width={120} height={120} />
              </div>
              <p className='text-muted-foreground'>Modern social network for the new generation</p>
            </div>

            <div>
              <h3 className='mb-4 font-semibold'>Product</h3>
              <ul className='text-muted-foreground space-y-2'>
                <li>
                  <Link href='#' className='hover:text-primary'>
                    Features
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-primary'>
                    Security
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-primary'>
                    API
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-primary'>
                    Mobile App
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='mb-4 font-semibold'>Company</h3>
              <ul className='text-muted-foreground space-y-2'>
                <li>
                  <Link href='#' className='hover:text-primary'>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-primary'>
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-primary'>
                    Press
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-primary'>
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='mb-4 font-semibold'>Support</h3>
              <ul className='text-muted-foreground space-y-2'>
                <li>
                  <Link href='#' className='hover:text-primary'>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-primary'>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href='/terms' className='hover:text-primary'>
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href='/privacy' className='hover:text-primary'>
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='text-muted-foreground mt-8 border-t pt-8 text-center'>
            <p>&copy; 2024 Twilsta. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
