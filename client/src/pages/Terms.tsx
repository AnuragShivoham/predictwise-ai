import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GradientOrbs from '@/components/GradientOrbs';
import { FileText, ArrowLeft } from 'lucide-react';

const Terms = () => {
  const lastUpdated = "December 26, 2025";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using QPatternLab ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. We reserve the right to modify these terms at any time, and your continued use of the Service constitutes acceptance of any changes.`
    },
    {
      title: "2. Description of Service",
      content: `QPatternLab is an AI-powered exam question prediction platform that analyzes previous year question papers to predict likely exam questions. The Service is provided "as is" and predictions are based on pattern analysis and should be used as a study aid only, not as a guarantee of exam content.`
    },
    {
      title: "3. User Accounts",
      content: `To access certain features of the Service, you must create an account. You are responsible for:
      • Maintaining the confidentiality of your account credentials
      • All activities that occur under your account
      • Providing accurate and complete registration information
      • Notifying us immediately of any unauthorized use of your account`
    },
    {
      title: "4. Acceptable Use",
      content: `You agree NOT to:
      • Use the Service for any illegal purpose or in violation of any laws
      • Upload malicious files, viruses, or harmful content
      • Attempt to gain unauthorized access to our systems
      • Share your account credentials with others
      • Use automated systems to access the Service without permission
      • Reproduce, duplicate, or resell any part of the Service
      • Upload copyrighted materials without proper authorization`
    },
    {
      title: "5. Intellectual Property",
      content: `All content, features, and functionality of the Service, including but not limited to text, graphics, logos, and software, are owned by QPatternLab and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute any part of the Service without our express written consent.`
    },
    {
      title: "6. User Content",
      content: `By uploading question papers or other content to the Service, you:
      • Retain ownership of your content
      • Grant us a license to process and analyze your content for providing the Service
      • Confirm you have the right to upload such content
      • Understand that uploaded content is processed temporarily and not stored permanently`
    },
    {
      title: "7. Disclaimer of Warranties",
      content: `THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. We do not guarantee:
      • The accuracy of predictions or analysis results
      • That the Service will be uninterrupted or error-free
      • That predictions will match actual exam questions
      • The reliability of any information obtained through the Service
      
      Predictions are for educational purposes only and should supplement, not replace, thorough exam preparation.`
    },
    {
      title: "8. Limitation of Liability",
      content: `To the maximum extent permitted by law, QPatternLab shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses resulting from your use of the Service.`
    },
    {
      title: "9. Payment and Billing",
      content: `If you subscribe to paid features:
      • You agree to pay all applicable fees
      • Fees are non-refundable unless otherwise stated
      • We may change pricing with reasonable notice
      • You are responsible for all charges incurred under your account`
    },
    {
      title: "10. Termination",
      content: `We reserve the right to suspend or terminate your account at any time for:
      • Violation of these Terms
      • Fraudulent or illegal activity
      • Non-payment of fees
      • Any reason at our sole discretion with reasonable notice`
    },
    {
      title: "11. Governing Law",
      content: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of India.`
    },
    {
      title: "12. Contact Information",
      content: `For questions about these Terms of Service, please contact us at:
      • Email: legal@qpatternlab.com
      • Address: QPatternLab, India`
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
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Terms of <span className="text-gradient">Service</span>
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
                  Please read these Terms of Service carefully before using QPatternLab. 
                  By using our service, you agree to be bound by these terms.
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

export default Terms;
