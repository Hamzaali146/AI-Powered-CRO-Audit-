from typing import List, Dict
from pydantic import HttpUrl
from ..schemas.base import BaseModel
import random
import uuid

class CROIssue(BaseModel):
    category: str
    issue: str
    severity: str  # High, Medium, Low
    impact_score: int  # 1-100
    description: str
    potential_uplift: float

class CompetitorData(BaseModel):
    name: str
    conversion_rate: float
    estimated_revenue: int
    key_advantage: str

class CROAuditResult(BaseModel):
    audit_id: str
    website_url: str
    current_metrics: Dict
    issues_found: List[CROIssue]
    competitor_analysis: List[CompetitorData]
    revenue_potential: Dict
    recommendations: List[str]
    confidence_score: int

class SiteAnalysisRequest(BaseModel):
    website_url: HttpUrl
    monthly_visitors: int
    current_conversion_rate: float
    average_order_value: float
    industry: str = "ecommerce"
    primary_goal: str

# --- Core Logic ---
def generate_cro_issues(website_url: str, conversion_rate: float, aov: float) -> List[CROIssue]:
    # ...copy logic from reference_code.py...
    issue_templates = [
        {"category": "Checkout Process", "issues": [
            "Multi-step checkout causing 34% cart abandonment",
            "Missing trust badges on checkout page",
            "No guest checkout option available",
            "Payment method limitations detected",
            "Unexpected shipping costs revealed at checkout"
        ]},
        {"category": "Product Pages", "issues": [
            "Product images lacking zoom functionality",
            "Missing product reviews and ratings",
            "Unclear product descriptions and benefits",
            "No size guide or product specifications",
            "Poor mobile product page experience"
        ]},
        {"category": "Site Performance", "issues": [
            "Page load time exceeding 3.2 seconds",
            "Mobile site speed issues detected",
            "Images not optimized for web",
            "Third-party scripts slowing site",
            "Core Web Vitals failing Google standards"
        ]},
        {"category": "User Experience", "issues": [
            "No live chat or customer support visible",
            "Search functionality returning poor results",
            "Navigation menu too complex",
            "Missing breadcrumb navigation",
            "No clear value proposition on homepage"
        ]},
        {"category": "Social Proof", "issues": [
            "No customer testimonials displayed",
            "Missing social media integration",
            "No urgency or scarcity indicators",
            "Return policy not prominently displayed",
            "No security certifications visible"
        ]}
    ]
    issues = []
    num_issues = random.randint(8, 15)
    severity_weights = {
        "High": 0.4 if conversion_rate < 2.0 else 0.2,
        "Medium": 0.4,
        "Low": 0.2 if conversion_rate < 2.0 else 0.4
    }
    used_issues = set()
    for _ in range(num_issues):
        category_data = random.choice(issue_templates)
        available_issues = [issue for issue in category_data["issues"] if issue not in used_issues]
        if not available_issues:
            continue
        issue_text = random.choice(available_issues)
        used_issues.add(issue_text)
        severity = random.choices(list(severity_weights.keys()), weights=list(severity_weights.values()))[0]
        if severity == "High":
            impact_score = random.randint(70, 95)
            potential_uplift = random.uniform(15, 45)
        elif severity == "Medium":
            impact_score = random.randint(40, 69)
            potential_uplift = random.uniform(8, 20)
        else:
            impact_score = random.randint(15, 39)
            potential_uplift = random.uniform(2, 10)
        descriptions = {
            "Checkout Process": f"This checkout issue is costing you approximately {random.randint(20, 50)}% of potential conversions.",
            "Product Pages": f"Product page optimization could increase conversion rates by {random.randint(10, 25)}%.",
            "Site Performance": f"Site speed improvements typically result in {random.randint(15, 30)}% conversion uplift.",
            "User Experience": f"UX improvements in this area show average gains of {random.randint(12, 28)}%.",
            "Social Proof": f"Adding social proof elements can boost conversions by {random.randint(8, 22)}%."
        }
        issues.append(CROIssue(
            category=category_data["category"],
            issue=issue_text,
            severity=severity,
            impact_score=impact_score,
            potential_uplift=round(potential_uplift, 1),
            description=descriptions[category_data["category"]]
        ))
    return sorted(issues, key=lambda x: x.impact_score, reverse=True)

def generate_competitor_data(industry: str, current_cr: float) -> List[CompetitorData]:
    competitor_names = [
        "Market Leader Pro", "Industry Pioneer", "Conversion Expert Co",
        "E-commerce Elite", "Digital Commerce Pro", "Online Retail Master"
    ]
    competitors = []
    for i in range(3):
        competitor_cr = current_cr + random.uniform(0.5, 2.5)
        estimated_revenue = random.randint(500000, 2000000)
        advantages = [
            "Superior checkout experience",
            "Advanced personalization engine",
            "Comprehensive review system",
            "Mobile-first design approach",
            "AI-powered product recommendations",
            "Optimized email marketing funnel"
        ]
        competitors.append(CompetitorData(
            name=competitor_names[i],
            conversion_rate=round(competitor_cr, 2),
            estimated_revenue=estimated_revenue,
            key_advantage=random.choice(advantages)
        ))
    return competitors

def calculate_revenue_potential(monthly_visitors: int, current_cr: float, aov: float, issues: List[CROIssue]) -> Dict:
    current_monthly_revenue = monthly_visitors * (current_cr / 100) * aov
    total_uplift_potential = sum(issue.potential_uplift for issue in issues[:5])
    realistic_uplift = total_uplift_potential * 0.7
    new_conversion_rate = current_cr * (1 + realistic_uplift / 100)
    new_monthly_revenue = monthly_visitors * (new_conversion_rate / 100) * aov
    monthly_uplift = new_monthly_revenue - current_monthly_revenue
    annual_uplift = monthly_uplift * 12
    return {
        "current_monthly_revenue": round(current_monthly_revenue),
        "potential_monthly_revenue": round(new_monthly_revenue),
        "monthly_revenue_uplift": round(monthly_uplift),
        "annual_revenue_uplift": round(annual_uplift),
        "current_conversion_rate": round(current_cr, 2),
        "potential_conversion_rate": round(new_conversion_rate, 2),
        "total_uplift_percentage": round(realistic_uplift, 1),
        "roi_timeframe": f"{random.randint(2, 6)} months"
    }

def generate_recommendations(issues: List[CROIssue]) -> List[str]:
    recommendations_map = {
        "Checkout Process": [
            "Implement single-page checkout with progress indicators",
            "Add multiple payment options including digital wallets",
            "Display trust badges and security certifications prominently",
            "Offer guest checkout option alongside account creation",
            "Show all costs upfront including shipping and taxes"
        ],
        "Product Pages": [
            "Add high-quality product images with 360° view capability",
            "Implement user-generated content and review system",
            "Create detailed product specifications and size guides",
            "Add related product recommendations",
            "Optimize product page layout for mobile devices"
        ],
        "Site Performance": [
            "Optimize images and implement lazy loading",
            "Minimize and compress CSS/JavaScript files",
            "Implement Content Delivery Network (CDN)",
            "Remove unused third-party scripts",
            "Upgrade hosting infrastructure for better performance"
        ],
        "User Experience": [
            "Add live chat or chatbot for instant customer support",
            "Improve site search with filters and autocomplete",
            "Simplify navigation menu structure",
            "Add clear call-to-action buttons throughout the site",
            "Create mobile-first responsive design"
        ],
        "Social Proof": [
            "Display customer testimonials on key pages",
            "Add social media feeds and sharing options",
            "Implement urgency indicators (stock levels, time-limited offers)",
            "Prominently display return and refund policies",
            "Show security badges and certifications"
        ]
    }
    top_issues = sorted(issues, key=lambda x: x.impact_score, reverse=True)[:5]
    recommendations = []
    for issue in top_issues:
        category_recommendations = recommendations_map.get(issue.category, [])
        if category_recommendations:
            recommendation = random.choice(category_recommendations)
            if recommendation not in recommendations:
                recommendations.append(recommendation)
    general_recommendations = [
        "Implement A/B testing framework for continuous optimization",
        "Set up conversion tracking and analytics dashboards",
        "Create abandoned cart email recovery sequence",
        "Optimize for mobile-first user experience",
        "Implement exit-intent popups with compelling offers"
    ]
    recommendations.extend(random.sample(general_recommendations, 2))
    return recommendations[:8]
