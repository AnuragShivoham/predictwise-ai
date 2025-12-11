import { motion } from "framer-motion";
import { Upload, Cpu, LineChart, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your PYQs",
    description:
      "Upload 5-10 years of previous question papers in any format - PDF, images, or text. Our system supports multiple file uploads.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Processing",
    description:
      "Our AI engine extracts questions, categorizes them by topic, analyzes patterns, and identifies high-frequency areas.",
  },
  {
    icon: LineChart,
    step: "03",
    title: "View Analytics",
    description:
      "Explore comprehensive dashboards showing topic trends, difficulty progression, and chapter-wise probability scores.",
  },
  {
    icon: Download,
    step: "04",
    title: "Get Predictions",
    description:
      "Download your AI-generated predicted question paper with probability scores for each question.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
            How <span className="text-gradient">QPatternLab</span> Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Four simple steps to transform years of question papers into accurate
            predictions for your next exam.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 relative z-10">
                  {/* Step number */}
                  <div className="absolute -top-4 -right-2 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {step.step}
                  </div>

                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
