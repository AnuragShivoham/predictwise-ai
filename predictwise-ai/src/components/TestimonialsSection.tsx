import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "JEE Aspirant",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=b6e3f4",
    content:
      "QPatternLab predicted 70% of the questions that appeared in my JEE Mains! The topic analysis helped me focus on high-weightage areas.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "NEET Student",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul&backgroundColor=c0aede",
    content:
      "The trend visualization feature is amazing. I could see exactly which biology topics were becoming more important over the years.",
    rating: 5,
  },
  {
    name: "Dr. Anjali Gupta",
    role: "Coaching Institute Director",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=anjali&backgroundColor=ffd5dc",
    content:
      "We've integrated QPatternLab into our test prep curriculum. The accuracy of predictions has significantly improved our students' performance.",
    rating: 5,
  },
  {
    name: "Arjun Patel",
    role: "UPSC Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun&backgroundColor=d1d4f9",
    content:
      "For UPSC prelims, understanding question patterns is crucial. This platform gave me data-driven insights that books couldn't provide.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
            Trusted by <span className="text-gradient">Thousands</span> of
            Students
          </h2>
          <p className="text-muted-foreground text-lg">
            See how QPatternLab has helped students and educators achieve better
            exam results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-card border border-border/50 relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-secondary text-secondary"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
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
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
