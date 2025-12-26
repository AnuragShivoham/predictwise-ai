import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GradientOrbs from '@/components/GradientOrbs';
import { Shield, ArrowLeft } from 'lucide-react';

const Privacy = () => {
  const lastUpdated = "December 26, 2025";

  const sections = [
    {
      title: "1. Introduction",
      content: `QPatternLab ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered exam question prediction service. Please read this policy carefully to understand our practices regarding your personal data.`
    },
    {
      title: "2. Information We Collect",
      content: `We collect the following types of information:

Account Information:
• Email address
• Name (optional)
• Password (encrypted)
• Authentication provider data (if using Google Sign-In)

Usage Data:
• Analysis history and preferences
• Device information and browser type
• IP address and approximate location
• Pages visited and features used

Uploaded Content:
• Question papers and documents you upload for analysis
• These are processed temporarily and NOT stored permanently`
    },
    {
      title: "3. How We Use Your Information",
      content: `We use your information to:
• Provide and maintain our Service
• Process and analyze uploaded question papers
• Create and manage your account
• Send important service notifications
• Improve and optimize our Service
• Respond to your inquiries and support requests
• Detect and prevent fraud or abuse
• Comply with legal obligations`
    },
    {
      title: "4. Data Processing and Storage",
      content: `Document Processing:
• Uploaded files are processed in real-time for analysis
• Files are NOT permanently stored on our servers
• Analysis results may be cached temporarily to improve performance
• You can delete your analysis history at any time

Data Storage:
• Account data is stored securely using Supabase
• All data is encrypted in transit and at rest
• We use industry-standard security measures`
    },
    {
      title: "5. Third-Party Services",
      content: `We use the following third-party services:

• Supabase: For authentication and database services
• OpenAI: For AI-powered analysis (document content is sent for processing)
• Google OAuth: For optional sign-in functionality

These services have their own privacy policies, and we encourage you to review them. We only share the minimum data necessary for these services to function.`
    },
    {
      title: "6. Data Sharing and Disclosure",
      content: `We do NOT sell your personal information. We may share your data only:
• With your consent
• To comply with legal obligations
• To protect our rights and safety
• With service providers who assist in operating our Service (under strict confidentiality agreements)
• In connection with a merger, acquisition, or sale of assets (with notice to you)`
    },
    {
      title: "7. Data Security",
      content: `We implement appropriate security measures including:
• SSL/TLS encryption for all data transmission
• Encrypted password storage using industry-standard hashing
• Regular security audits and updates
• Access controls and authentication
• Secure cloud infrastructure

However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.`
    },
    {
      title: "8. Your Rights and Choices",
      content: `You have the right to:
• Access your personal data
• Correct inaccurate data
• Delete your account and associated data
• Export your data
• Opt-out of marketing communications
• Withdraw consent at any time

To exercise these rights, contact us at privacy@qpatternlab.com or use the settings in your account.`
    },
    {
      title: "9. Cookies and Tracking",
      content: `We use cookies and similar technologies for:
• Authentication and session management
• Remembering your preferences
• Analytics and performance monitoring

You can control cookies through your browser settings. Disabling cookies may affect some features of the Service.`
    },
    {
      title: "10. Children's Privacy",
      content: `Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.`
    },
    {
      title: "11. International Data Transfers",
      content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.`
    },
    {
      title: "12. Data Retention",
      content: `We retain your data for as long as:
• Your account is active
• Necessary to provide our services
• Required by law

You can request deletion of your account and data at any time. Some data may be retained in backups for a limited period.`
    },
    {
      title: "13. Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by:
• Posting the new policy on this page
• Updating the "Last updated" date
• Sending an email notification for significant changes

Your continued use of the Service after changes constitutes acceptance of the updated policy.`
    },
    {
      title: "14. Contact Us",
      content: `If you have questions about this Privacy Policy or our data practices, please contact us:

• Email: privacy@qpatternlab.com
• Address: QPatternLab, India

For data protection inquiries, you may also contact our Data Protection Officer at dpo@qpatternlab.com.`
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <GradientOrbs variant="minimal" />
      <Navbar />
      
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Privacy <span className="text-gradient">Policy</span>
              </h1>
              <p className="text-muted-foreground">
                Last updated: {lastUpdated}
              </p>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 rounded-2xl"
            >
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-muted-foreground mb-8">
                  Your privacy is important to us. This policy describes how QPatternLab collects, 
                  uses, and protects your personal information.
                </p>

                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="mb-8"
                  >
                    <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {section.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
