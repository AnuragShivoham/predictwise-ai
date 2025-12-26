import { motion } from "framer-motion";
import { Upload, Brain, BarChart3, Download, ArrowRight, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Papers",
    description: "Upload your previous year question papers in PDF or image format.",
    details: ["Supports PDF, PNG, JPG", "Batch upload up to 20 files", "OCR for scanned documents"],
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our AI analyzes patterns, topics, and question frequency across papers.",
    details: ["Pattern recognition", "Topic clustering", "Difficulty assessment"],
  },
  {
    icon: BarChart3,
    title: "View Predictions",
    description: "Get detailed predictions with probability scores and topic insights.",
    details: ["Probability rankings", "Topic weightage", "Trend visualization"],
  },
  {
    icon: Download,
    title: "Export Results",
    description: "Download your predicted question paper in multiple formats.",
    details: ["HTML, PDF, CSV", "Shareable reports", "Print-ready format"],
  },
];

const HowItWorksSection = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-muted/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to predict your exam questions with AI precision
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden lg:block absolute top-20 left-[12%] right-[12%] h-0.5">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-primary via-accent to-primary origin-left"
              />
            </div>

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  className="glass-card p-6 rounded-2xl h-full relative z-10"
                >
                  {/* Step Number */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                    className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow"
                  >
                    {index + 1}
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-primary/10 flex items-center justify-center mb-5"
                  >
                    <step.icon className="w-8 h-8 text-primary" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground mb-4">{step.description}</p>

                  {/* Details */}
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 + i * 0.1 + 0.5 }}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                        {detail}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Arrow (Mobile) */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-4 lg:hidden">
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-6 h-6 text-primary rotate-90" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          {[
            { value: "< 30s", label: "Processing Time" },
            { value: "99.9%", label: "Uptime" },
            { value: "Free", label: "To Start" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-gradient">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
