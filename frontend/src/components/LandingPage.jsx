import React from "react";
import { FiPlayCircle, FiTarget } from "react-icons/fi";
import { Brain, PlayCircle, Repeat, TrendingUp, Zap } from "lucide-react";
import { motion, useAnimate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SessionContext } from "../contextApi/SessionContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { setSessionId } = useContext(SessionContext);

  // function to handle navigation to form page
  const handleNavigate = async () => {
    // Create a new session before navigating
    try {
      const res = await fetch("http://127.0.0.1:5000/api/create_session");
      const data = await res.json();

      setSessionId(data.session_id);
      // If session creation is successful, navigate to form page
      if (res.status === 201) {
        navigate("/form");
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
    >
      <motion.nav
        initial={{ y: "-400px" }}
        animate={{ y: "-10px" }}
        transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
      >
        Forge
      </motion.nav>
      <section className="hero">
        <h1>Turn Practice Into Mastery.</h1>
        <p className="subtitle">
          An intelligent, adaptive system that evolves with you. Forge doesn't
          just train, it learns, adapts, and refines your path to expertise.
        </p>
        <motion.button
          className="cta-btn"
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 0px 8px #ff6a1a",
          }}
          onClick={handleNavigate}
        >
          Start Forging
        </motion.button>
      </section>

      <main>
        <div className="card">
          <header>
            <h2>What is forge?</h2>
            <p className="subtitle">
              More than a platform-a dynamic learning partner thah grows with
              you
            </p>
          </header>
          <p>
            Forge is an intelligent practice system that evolves wiith you.
            Instead of static courses or generic prompts, it observes your
            progress, learns from your patterns, and continously refines your
            training strategy to maximize growth.
          </p>
        </div>

        <div className="card featured">
          <header>
            <h2>How Forge Thinks</h2>
            <p className="subtitle">
              A four-stage intelligent system that adapts in real-time
            </p>
          </header>
          <div className="feature-list">
            <motion.div
              className="feature-item"
              whileHover={{
                scale: 1.04,
                borderColor: "rgba(255, 106, 26, 0.3)",
                originY: 0,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="feature-icon">
                <FiTarget
                  style={{
                    color: "#ff8c42",
                    width: "32px",
                    height: "32px",
                  }}
                />
              </div>
              <h3>Define Your Skill</h3>
              <p>
                Specify what you want to master. Forge understands your goals
                and creates a personalized learning framework.
              </p>
            </motion.div>

            <motion.div
              className="feature-item"
              whileHover={{
                scale: 1.04,
                borderColor: "rgba(255, 106, 26, 0.3)",
                originY: 0,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="feature-icon">
                <Brain
                  style={{
                    color: "#ff8c42",
                    width: "32px",
                    height: "32px",
                  }}
                />
              </div>
              <h3>Intelligent Planning</h3>
              <p>
                Forge breaks skills into measurable components and designs
                optimized practice loops tailored to your needs.
              </p>
            </motion.div>

            <motion.div
              className="feature-item"
              whileHover={{
                scale: 1.04,
                borderColor: "rgba(255, 106, 26, 0.3)",
                originY: 0,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="feature-icon">
                <Repeat
                  style={{
                    color: "#ff8c42",
                    width: "32px",
                    height: "32px",
                  }}
                />
              </div>
              <h3>Guided Practice</h3>
              <p>
                Practice with purpose. Log reflections, track progress, and
                receive intelligent feedback—all without pressure.
              </p>
            </motion.div>

            <motion.div
              className="feature-item"
              whileHover={{
                scale: 1.04,
                borderColor: "rgba(255, 106, 26, 0.3)",
                originY: 0,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="feature-icon">
                <TrendingUp
                  style={{
                    color: "#ff8c42",
                    width: "32px",
                    height: "32px",
                  }}
                />
              </div>
              <h3>Adaptive Evolution</h3>
              <p>
                Forge analyzes patterns, detects plateaus, and automatically
                adjusts your training plan for continuous growth.
              </p>
            </motion.div>
          </div>
        </div>
        <div className="card">
          <header>
            <h2>A Learning System That Evolves</h2>
            <p className="subtitle">
              Watch as Forge intelligently adapts your learning path over time
            </p>
          </header>
          <div className="timeline">
            <div className="timeline-item">
              <div className="week">Week 1</div>
              <p className="description">
                Initial assessment and personalized strategy development
              </p>
            </div>

            <div className="timeline-item">
              <div className="week">Week 2</div>
              <p className="description">
                Intelligent difficulty scaling based on performance patterns
              </p>
            </div>
            <div className="timeline-item">
              <div className="week">Week 3</div>
              <p className="description">
                Level detection and adaptive intervention strategies
              </p>
            </div>

            <div className="timeline-item">
              <div className="week">Week 4+</div>
              <p className="description">
                Continuous optimization and mastery pathway refinement
              </p>
            </div>
          </div>
        </div>
      </main>

      <section className="bottom-cta">
        <h2>Ready to Transform Your Practice?</h2>
        <p>
          Join the next generation of skill development. Start with Forge today
          and experience learning that evolves with you.
        </p>
        <button className="cta-button" onClick={handleNavigate}>
          <Zap size={20} />
          Start Your Mastery Journey
        </button>
      </section>
    </motion.div>
  );
}
