import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Mail, Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-background">
                QPatternLab
              </span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              AI-powered exam prediction platform that transforms years of question
              papers into accurate predictions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Upload", "Dashboard", "How it Works"].map((link) => (
                <li key={link}>
                  <Link
                    to={link === "Home" ? "/" : `/${link.toLowerCase().replace(/ /g, "-")}`}
                    className="text-background/70 hover:text-background text-sm transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Resources</h4>
            <ul className="space-y-2">
              {["Documentation", "API Reference", "Privacy Policy", "Terms of Service"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-background/70 hover:text-background text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Contact</h4>
            <div className="flex items-center gap-2 text-background/70 text-sm mb-4">
              <Mail className="w-4 h-4" />
              support@qpatternlab.com
            </div>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/50 text-sm">
              © 2024 QPatternLab. All rights reserved.
            </p>
            <p className="text-background/50 text-sm">
              Made with ❤️ for students worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
