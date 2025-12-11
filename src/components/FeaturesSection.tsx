import { motion } from "framer-motion";
import {
  Upload,
  Brain,
  BarChart3,
  FileDown,
  Search,
  Zap,
  Shield,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Multi-Format Upload",
    description:
      "Upload PYQs in PDF, text, images, or manually type questions. Our OCR technology extracts data from any format.",
  },
  {
    icon: Brain,
    title: "AI Pattern Analysis",
    description:
      "Advanced machine learning algorithms identify recurring topics, question patterns, and syllabus evolution.",
  },
  {
    icon: Search,
    title: "Topic Categorization",
    description:
      "Automatically categorize questions by chapter, topic, and difficulty level for comprehensive analysis.",
  },
  {
    icon: BarChart3,
    title: "Trend Visualization",
    description:
      "Interactive charts showing topic frequency, difficulty trends, and chapter-wise weightage over years.",
  },
  {
    icon: Zap,
    title: "Probability Scoring",
    description:
      "Each predicted question comes with a probability score based on historical data and recurrence patterns.",
  },
  {
    icon: FileDown,
    title: "PDF Export",
    description:
      "Download your predicted question paper in professional PDF format, ready for practice sessions.",
  },
  {
    icon: Shield,
    title: "Secure Processing",
    description:
      "Your uploaded papers are encrypted and processed securely. We prioritize your data privacy.",
  },
  {
    icon: Clock,
    title: "Fast Results",
    description:
      "Get predictions within minutes. Our optimized AI engine processes years of data efficiently.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
            Everything You Need for{" "}
            <span className="text-gradient">Smart Preparation</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our comprehensive platform combines advanced AI with intuitive design
            to give you the best exam preparation experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 border border-border/50"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-gradient-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
