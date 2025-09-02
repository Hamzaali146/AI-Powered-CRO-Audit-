from fastapi import APIRouter, HTTPException
from app.services.cro_audit_service import (
    SiteAnalysisRequest, CROAuditResult,
    generate_cro_issues, generate_competitor_data,
    calculate_revenue_potential, generate_recommendations
)
import uuid
import random

class CROAuditRouter:
    def __init__(self):
        self.router = APIRouter()
        self.audit_results = {}
        self.router.post("/analyze", response_model=CROAuditResult)(self.analyze_website)
        self.router.get("/audit/{audit_id}", response_model=CROAuditResult)(self.get_audit_result)

    async def analyze_website(self, request: SiteAnalysisRequest):
        try:
            audit_id = str(uuid.uuid4())
            issues = generate_cro_issues(str(request.website_url), request.current_conversion_rate, request.average_order_value)
            competitors = generate_competitor_data(request.industry, request.current_conversion_rate)
            revenue_potential = calculate_revenue_potential(
                request.monthly_visitors,
                request.current_conversion_rate,
                request.average_order_value,
                issues
            )
            recommendations = generate_recommendations(issues)
            confidence_score = random.randint(85, 97)
            result = CROAuditResult(
                audit_id=audit_id,
                website_url=str(request.website_url),
                current_metrics={
                    "monthly_visitors": request.monthly_visitors,
                    "conversion_rate": request.current_conversion_rate,
                    "average_order_value": request.average_order_value,
                    "monthly_revenue": round(request.monthly_visitors * (request.current_conversion_rate / 100) * request.average_order_value)
                },
                issues_found=issues,
                competitor_analysis=competitors,
                revenue_potential=revenue_potential,
                recommendations=recommendations,
                confidence_score=confidence_score
            )
            self.audit_results[audit_id] = result
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    async def get_audit_result(self, audit_id: str):
        if audit_id not in self.audit_results:
            raise HTTPException(status_code=404, detail="Audit not found")
        return self.audit_results[audit_id]
