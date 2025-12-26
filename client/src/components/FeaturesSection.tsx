import { motion } from "framer-motion";
import { Brain, FileSearch, TrendingUp, Zap, Shield, Clock, BarChart3, Sparkles } from "lucide-react";
import GradientOrbs from "./GradientOrbs";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning algorithms analyze question patterns and predict likely topics.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: FileSearch,
    title: "Smart OCR",
    description: "Extract text from scanned PDFs and images with high accuracy using Tesseract.js.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: TrendingUp,
    title: "Trend Detection",
    description: "Identify recurring topics and patterns across multiple years of question papers.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get predictions in seconds with our optimized processing pipeline.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your documents are processed securely and never stored permanently.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Comprehensive dashboards showing topic weightage and difficulty trends.",
    gradient: "from-indigo-500 to-violet-500",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <GradientOrbs variant="page" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Powerful Features</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Ace Your Exams</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with intuitive design to give you 
            the best exam preparation experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass-card h-full p-6 rounded-2xl group cursor-pointer"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 group-hover:text-gradient transition-all">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  className={`h-1 mt-5 rounded-full bg-gradient-to-r ${feature.gradient} origin-left`}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="glass-card inline-flex items-center gap-4 px-6 py-4 rounded-2xl">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">
              Average analysis time: <span className="font-semibold text-foreground">under 30 seconds</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
