import type React from "react"
import { BookOpen, Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-400" />
              <span className="font-bold text-xl">AML</span>
            </div>
            <p className="text-gray-400">
              Advanced Media Library provides access to books, journals, and multimedia across all branches in England.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Facebook size={18} />} href="#" />
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Instagram size={18} />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/catalog">Catalog</FooterLink>
              <FooterLink href="/subscriptions">Subscriptions</FooterLink>
              <FooterLink href="/events">Events</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/accessibility">Accessibility</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-blue-400 mt-0.5" />
                <span>contact@advancedmedialibrary.co.uk</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-blue-400 mt-0.5" />
                <span>+44 20 1234 5678</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Advanced Media Library. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <span className="text-gray-400 cursor-default">{children}</span>
    </li>
  )
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return <span className="bg-gray-800 p-2 rounded-full cursor-default inline-flex">{icon}</span>
}
