@import "tailwindcss";

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.shimmer-btn {
  background-size: 200% auto;
  animation: shimmer 3s linear infinite;
}

.float-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes runefade {
  0%{opacity:0} 40%{opacity:1} 70%{opacity:1} 100%{opacity:0}
}
@keyframes ritualRing {
  0%{transform:scale(0) rotate(0deg);opacity:0.9}
  60%{transform:scale(1.2) rotate(180deg);opacity:0.8}
  100%{transform:scale(2.5) rotate(360deg);opacity:0}
}
@keyframes pulse-red {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

.listening-active {
  animation: pulse-red 1.5s infinite;
}
