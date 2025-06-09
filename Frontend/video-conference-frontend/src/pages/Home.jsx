import React from 'react';
import { Link } from 'react-router';
import { Video, ArrowRight, Users, MessageSquare, Shield, Zap, Globe } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import Button from '../ui/Button'; 
import { Check } from 'lucide-react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import MainLayout from '../layouts/MainLayout';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const slideInLeft = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
};

const slideInRight = {
  hidden: { x: 50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
};

const AnimatedSection = ({ children, variants = fadeInVariants, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <Video className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">MeetNow</span>
        </motion.div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-4"
        >
          {/* <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link> */}
          <Link to="/login">
            <Button>Login<ArrowRight className="ml-2 h-5 w-5" /></Button>
          </Link>
          <ThemeToggle />
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
        {/* Left Content */}
        <AnimatedSection variants={slideInLeft} className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Connect with anyone, anywhere, anytime
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            High-quality video meetings for teams and individuals. Secure, reliable, and easy to use with crystal-clear
            audio and HD video.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/create-meeting">
              <Button size="lg" className="w-full sm:w-auto">
                Create Meeting <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/join-meeting">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Join Meeting
              </Button>
            </Link>
          </div>
        </AnimatedSection>

        {/* Right Image */}
        <AnimatedSection variants={slideInRight} className="md:w-1/2">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25"></div>
            <img
              src="/src/assets/video-conference-illustration.png"
              alt="Video conference illustration"
              className="relative rounded-[30px] shadow-xl"
            />
          </div>
        </AnimatedSection>
      </section>

      {/* Features Section */}
      <AnimatedSection variants={containerVariants}>
        <section className="bg-white dark:bg-gray-800 py-20">
          <div className="container mx-auto px-4">
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-4 dark:text-white">
              Why Choose MeetNow?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Our platform is designed to provide the best video conferencing experience with features that make your
              meetings more productive and enjoyable.
            </motion.p>
            <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-8">
              {/* HD Video */}
              <motion.div variants={itemVariants} className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg transition-transform hover:scale-105">
                <div className="bg-blue-100 dark:bg-gray-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">HD Video Quality</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Crystal clear video and audio for productive meetings with adaptive quality based on your connection.
                </p>
              </motion.div>

              {/* Group Meetings */}
              <motion.div variants={itemVariants} className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg transition-transform hover:scale-105">
                <div className="bg-blue-100 dark:bg-gray-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Group Meetings</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Host meetings with up to 100 participants at once with grid view and speaker highlighting.
                </p>
              </motion.div>

              {/* Chat & Share */}
              <motion.div variants={itemVariants} className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg transition-transform hover:scale-105">
                <div className="bg-blue-100 dark:bg-gray-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Chat & Share</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Send messages and share files during your meetings with real-time chat and file sharing.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Advanced Features */}
      <AnimatedSection variants={containerVariants}>
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-16 dark:text-white">
              Advanced Features
            </motion.h2>
            <motion.div variants={containerVariants} className="grid md:grid-cols-2 gap-16">
              {/* Encryption */}
              <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">End-to-End Encryption</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your meetings are secure with end-to-end encryption. Only meeting participants can access the content.
                  </p>
                </div>
              </motion.div>

              {/* Low Latency */}
              <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center">
                    <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">Low Latency</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our optimized infrastructure ensures minimal delay in your video and audio, making conversations feel natural.
                  </p>
                </div>
              </motion.div>

              {/* Global Access */}
              <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center">
                    <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">Global Access</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Connect with participants from anywhere in the world with our globally distributed network of servers.
                  </p>
                </div>
              </motion.div>

              {/* Background Effects */}
              <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center">
                    <Video className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">Background Effects</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Blur your background or use virtual backgrounds to maintain privacy or add a touch of fun to your meetings.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Pricing Section */}
      <AnimatedSection variants={containerVariants}>
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-4 dark:text-white">
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={itemVariants} className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Choose the plan that works best for you and your team. All plans include our core features.
            </motion.p>

            <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <motion.div variants={itemVariants} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-transform hover:scale-105">
                <div className="p-6 bg-white dark:bg-gray-700">
                  <h3 className="text-xl font-bold mb-2 dark:text-white">Free</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">For personal use</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold dark:text-white">$0</span>
                    <span className="text-gray-600 dark:text-gray-300">/month</span>
                  </div>
                  <Button variant="outline" className="w-full">Get Started</Button>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-600">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-200">Up to 40 minute meetings</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-200">Up to 100 participants</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-200">HD video quality</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Pro Plan */}
              <motion.div variants={itemVariants} className="border-2 border-blue-500 dark:border-blue-400 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
                <div className="p-6 bg-white dark:bg-gray-700 relative">
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl">
                    POPULAR
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">Pro</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">For small teams</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold dark:text-white">$12</span>
                    <span className="text-gray-600 dark:text-gray-300">/month</span>
                  </div>
                  <Button className="w-full">Get Started</Button>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-600">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-200">Unlimited meeting duration</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-200">Up to 150 participants</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-200">Cloud recording (10GB)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-200">Advanced background effects</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Business Plan */}
              <motion.div variants={itemVariants} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-transform hover:scale-105">
                <div className="p-6 bg-white dark:bg-gray-700">
                  <h3 className="text-xl font-bold mb-2 dark:text-white">Business</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">For organizations</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold dark:text-white">$20</span>
                    <span className="text-gray-600 dark:text-gray-300">/month</span>
                  </div>
                  <Button variant="outline" className="w-full">Get Started</Button>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-600">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-200">Everything in Pro</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-200">Up to 250 participants</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-200">Cloud recording (Unlimited)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-200">Single Sign-On</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection variants={containerVariants}>
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-16 dark:text-white">
              What Our Users Say
            </motion.h2>

            <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-8">
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">J</span>
                  </div>
                  <div>
                    <h4 className="font-bold dark:text-white">John Smith</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Marketing Director</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "MeetNow has transformed how our marketing team collaborates. The video quality is exceptional, and the
                  interface is intuitive. Highly recommended!"
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">S</span>
                  </div>
                  <div>
                    <h4 className="font-bold dark:text-white">Sarah Johnson</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Remote Team Lead</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "As someone managing a fully remote team, MeetNow has been a game-changer. The reliability and features
                  like background blur have made our meetings much more professional."
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">M</span>
                  </div>
                  <div>
                    <h4 className="font-bold dark:text-white">Michael Chen</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Education Consultant</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                    <Star className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "I use MeetNow for online tutoring sessions. The screen sharing and virtual whiteboard features are
                  perfect for explaining complex concepts to my students."
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection>
        <section className="py-20 bg-blue-600 dark:bg-blue-800">
          <div className="container mx-auto px-4 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white mb-6"
            >
              Ready to transform your meetings?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
            >
              Join thousands of satisfied users who have made MeetNow their go-to video conferencing platform.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link to="/signup">
                <Button size="lg" variant="default" className="bg-white text-blue-600 hover:bg-gray-100">
                  Sign Up Free
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-700">
                  Contact Sales
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Product Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Features</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Pricing</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Integrations</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What's New</a></li>
              </ul>
            </motion.div>

            {/* Resources Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Help Center</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Tutorials</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Webinars</a></li>
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">About Us</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Careers</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Contact</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Press</a></li>
              </ul>
            </motion.div>

            {/* Legal Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Security</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Compliance</a></li>
              </ul>
            </motion.div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 mb-4 md:mb-0"
            >
              <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">MeetNow</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              © {new Date().getFullYear()} MeetNow. All rights reserved.
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function HomePage() {
  return (
    <MainLayout>
      <Home />
    </MainLayout>
  );
}