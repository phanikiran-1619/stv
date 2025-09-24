import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, MapPin, Shield, Wifi, CreditCard, Headphones, ArrowRight, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent } from '../components/ui/card.jsx';
import Navbar from '../components/Navbar.jsx';

const LandingPage = () => {
  const features = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Real Time Tracking',
      description: 'Track your bus location and get accurate arrival predictions.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure Booking',
      description: 'Bank-level security for your payments and personal data.'
    },
    {
      icon: <Bus className="h-6 w-6" />,
      title: 'Smart Routes',
      description: 'AI-powered route optimization for faster, comfortable journeys.'
    },
    {
      icon: <Wifi className="h-6 w-6" />,
      title: 'Free WiFi',
      description: 'Complimentary high-speed WiFi to stay connected on your journey.'
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Flexible Payment',
      description: 'Multiple payment options, including digital wallets and EMI.'
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs.'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar isAdmin={false} />

      {/* Hero Section */}
      <section className="text-center py-20 sm:py-32 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Travelling Smart with{' '}
            <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
              EmcomServ
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book bus tickets instantly, track your journey in real-time, and travel with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg transition-all duration-300"
            >
              Book Tickets
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                EmcomServ?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Modern features designed for seamless and comfortable bus travel.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group bg-card hover:bg-accent/50 transition-all duration-300 transform hover:scale-105 border border-border/50 hover:border-purple-500/30 shadow-lg hover:shadow-xl"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-purple-500 group-hover:text-purple-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Start Your{' '}
            <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
              Journey?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Join thousands of travelers choosing EmcomServ for seamless bus travel.
          </p>
          <Link to="/login">
            <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bus className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold">EmcomServ</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Making bus travel simple, safe, and comfortable for everyone.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-purple-500 cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-purple-500 cursor-pointer transition-colors" />
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-purple-500 cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-purple-500">Quick Links</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-purple-500 cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-purple-500 cursor-pointer transition-colors">How It Works</li>
                <li className="hover:text-purple-500 cursor-pointer transition-colors">Safety</li>
                <li className="hover:text-purple-500 cursor-pointer transition-colors">Careers</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-purple-500">Contact</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>+1 (555) 123-4567</li>
                <li>support@emcomserv.com</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-muted-foreground">
            <p>© 2025 EmcomServ. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;