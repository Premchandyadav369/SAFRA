import math
import random
from typing import Dict, Any, List

class StatisticalDistributions:
    """
    Statistical distributions for realistic payment generation without uniform randomness.
    """

    @staticmethod
    def generate_log_normal_amount(prng: random.Random, median: float, sigma: float = 0.65) -> float:
        """
        Generates transaction amount using log-normal distribution:
        ln(X) ~ Normal(mu, sigma^2) where mu = ln(median)
        """
        mu = math.log(max(10.0, median))
        val = prng.lognormvariate(mu, sigma)
        # Round to 2 decimal places with minimum amount of 10 INR
        return max(10.0, round(val, 2))

    @staticmethod
    def calculate_poisson_arrival_interval(prng: random.Random, rate_lambda: float) -> float:
        """
        Generates inter-arrival time (seconds) from non-homogeneous Poisson process.
        T_interval ~ Exponential(lambda)
        """
        rate = max(0.01, rate_lambda)
        return prng.expovariate(rate)

    @staticmethod
    def generate_pareto_latency(prng: random.Random, base_ms: float, alpha: float = 2.8) -> int:
        """
        Generates long-tailed provider latency using Pareto distribution:
        P(X > x) = (x_m / x)^alpha
        """
        # Pareto variate in python: prng.paretovariate(alpha) gives values >= 1
        scale = prng.paretovariate(alpha)
        # Cap excessive outliers to 8,000ms
        latency = int(base_ms * scale)
        return min(8000, latency)

    @staticmethod
    def compute_diurnal_multiplier(sim_hour_float: float) -> float:
        """
        Computes realistic 24-hour diurnal transaction multiplier.
        Peak at 14:00 - 21:00, trough at 03:00 - 05:00.
        """
        hour = sim_hour_float % 24.0
        # Double-peak model: afternoon commerce (14h) and evening peak (20h)
        base = 0.25
        morning = 0.7 * math.exp(-0.5 * ((hour - 12.0) / 3.0) ** 2)
        evening = 1.0 * math.exp(-0.5 * ((hour - 20.0) / 2.5) ** 2)
        return base + morning + evening
