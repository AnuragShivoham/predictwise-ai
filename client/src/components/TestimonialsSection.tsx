import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "B.Tech Student, AKTU",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
    content: "This tool predicted 7 out of 10 questions in my Data Structures exam! Absolutely incredible accuracy.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "JEE Aspirant",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    content: "The pattern analysis helped me focus on high-probability topics. Saved me countless hours of random studying.",
    rating: 5,
  },
  {
    name: "Amit Kumar",
    role: "GATE Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=amit",
    content: "The AI analysis is spot on. It identified trends I never noticed even after years of solving papers.",
    rating: 5,
  },
  {
    name: "Sneha Gupta",
    role: "NEET Aspirant",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sneha",
    content: "Finally, a tool that understands exam patterns! The predictions were surprisingly accurate for Biology.",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "MBA Student",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
    content: "Used it for my CAT prep. The topic weightage analysis was a game-changer for my preparation strategy.",
    rating: 5,
  },
  {
    name: "Ananya Reddy",
    role: "UPSC Aspirant",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya",
    content: "The trend detection feature helped me understand which topics are gaining importance over the years.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Loved by <span className="text-gradient">Students</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what students are saying about their experience with QPatternLab
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -8 }}
                className="glass-card p-6 rounded-2xl h-full relative"
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-12 h-12" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                    >
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    </motion.div>
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full bg-muted"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 glass-card p-8 rounded-2xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,000+", label: "Happy Students" },
              { value: "4.9/5", label: "Average Rating" },
              { value: "95%", label: "Prediction Accuracy" },
              { value: "50+", label: "Exam Types Supported" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
