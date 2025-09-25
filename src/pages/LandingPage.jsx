import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, MapPin, Shield, Wifi, CreditCard, Headphones, ArrowRight, Facebook, Twitter, Linkedin, Star, Users, Clock, Award } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent } from '../components/ui/card.jsx';
import Navbar from '../components/Navbar.jsx';

const LandingPage = () => {
  const features = [
    {
      icon: <MapPin className="h-7 w-7" />,
      title: 'Real Time Tracking',
      description: 'Track your bus location and get accurate arrival predictions with our advanced GPS system.',
      gradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-200 dark:border-emerald-700/50'
    },
    {
      icon: <Shield className="h-7 w-7" />,
      title: 'Secure Booking',
      description: 'Bank-level security with SSL encryption for your payments and personal data protection.',
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-700/50'
    },
    {
      icon: <Bus className="h-7 w-7" />,
      title: 'Smart Routes',
      description: 'AI-powered route optimization for faster, more comfortable and efficient journeys.',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-700/50'
    },
    {
      icon: <Wifi className="h-7 w-7" />,
      title: 'Free WiFi',
      description: 'Complimentary high-speed WiFi connectivity to stay connected throughout your journey.',
      gradient: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/20',
      borderColor: 'border-cyan-200 dark:border-cyan-700/50'
    },
    {
      icon: <CreditCard className="h-7 w-7" />,
      title: 'Flexible Payment',
      description: 'Multiple payment options including credit cards, digital wallets, UPI, and EMI facilities.',
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-200 dark:border-orange-700/50'
    },
    {
      icon: <Headphones className="h-7 w-7" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support with dedicated helpline for all your travel needs.',
      gradient: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20',
      borderColor: 'border-pink-200 dark:border-pink-700/50'
    }
  ];

  const stats = [
    { icon: <Users className="h-6 w-6" />, number: '50K+', label: 'Happy Customers' },
    { icon: <Bus className="h-6 w-6" />, number: '500+', label: 'Daily Routes' },
    { icon: <Clock className="h-6 w-6" />, number: '99.9%', label: 'On Time Performance' },
    { icon: <Award className="h-6 w-6" />, number: '4.9', label: 'Customer Rating' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Business Executive',
      comment: 'EmcomServ has revolutionized my daily commute. The real-time tracking and comfortable buses make traveling a pleasant experience.',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Software Developer',
      comment: 'Reliable service with excellent customer support. The mobile app is user-friendly and booking is seamless.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Manager',
      comment: 'Outstanding service quality and punctuality. The WiFi connectivity helps me stay productive during my journey.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-foreground transition-colors duration-300">
      <Navbar isAdmin={false} />

      {/* Hero Section */}
      <section className="relative text-center py-20 sm:py-32 px-4 sm:px-6 lg:px-8 pt-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-700 rounded-full px-6 py-3 mb-8 shadow-lg">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Trusted by 50,000+ Happy Travelers</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            Travelling Smart with{' '}
            <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
              EmcomServ
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of bus travel with real-time tracking, seamless bookings, and unmatched comfort. Your journey starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/login">
              <Button className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white px-8 sm:px-12 py-4 rounded-2xl text-lg sm:text-xl font-semibold transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-purple-500/25">
                Start Your Journey
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-500 hover:text-white px-8 sm:px-12 py-4 rounded-2xl text-lg sm:text-xl font-semibold transition-all duration-500 transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl"
            >
              Book Tickets
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-700 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{stat.number}</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-700 rounded-full px-4 py-2 mb-6">
              <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Premium Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
                EmcomServ?
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience modern bus travel with cutting-edge technology and uncompromising comfort designed for your convenience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`group bg-white dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-750 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border-2 ${feature.borderColor} hover:border-purple-400 dark:hover:border-purple-500 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/10 rounded-3xl overflow-hidden`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/20`}>
                    <div className="transition-transform duration-500 group-hover:scale-110">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-500">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-500">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              What Our{' '}
              <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
                Customers Say
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied travelers who choose EmcomServ for their daily commute and long journeys.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed italic">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-100">{testimonial.name}</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-br from-purple-600/10 via-purple-500/5 to-blue-600/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
            Ready to Start Your{' '}
            <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
              Journey?
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
            Join thousands of travelers choosing EmcomServ for safe, comfortable, and reliable bus travel experiences.
          </p>
          <Link to="/login">
            <Button className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white px-10 sm:px-16 py-5 rounded-2xl text-xl sm:text-2xl font-bold transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-3xl hover:shadow-purple-500/30">
              Get Started Now
              <ArrowRight className="ml-4 h-7 w-7" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t-2 border-purple-200 dark:border-purple-700 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bus className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">EmcomServ</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed max-w-md">
                Making bus travel simple, safe, and comfortable for everyone. Experience the future of transportation with our innovative solutions.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950/30 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                  <Facebook className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950/30 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                  <Twitter className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950/30 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                  <Linkedin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-lg text-purple-600 dark:text-purple-400">Quick Links</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors">How It Works</li>
                <li className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors">Safety & Security</li>
                <li className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors">Help Center</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-lg text-purple-600 dark:text-purple-400">Contact</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="font-semibold">24/7 Support</li>
                <li>+1 (555) 123-4567</li>
                <li>support@emcomserv.com</li>
                <li className="text-sm">Available in English, Spanish, French</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t-2 border-purple-200 dark:border-purple-700 pt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2025 EmcomServ. All rights reserved. | 
              <span className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer mx-2">Privacy Policy</span> | 
              <span className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer mx-2">Terms of Service</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;