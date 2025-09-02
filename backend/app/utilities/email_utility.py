import os
import re
import ssl
from typing import Literal, Optional, Tuple

from python_http_client.client import Response
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from app.core.config import settings
from app.core.monitoring.decorators import monitor_transaction


class EmailService:
    def __init__(self) -> None:
        self.sendgrid_client = SendGridAPIClient(settings.email.SENDGRID_API_KEY)
        self.from_email = settings.email.SENDGRID_FROM_EMAIL

        ssl._create_default_https_context = ssl._create_unverified_context

    @monitor_transaction(op="email.get_html_content")
    async def get_html_content(
        self, email_type: Literal["magic_link", "reset_otp"]
    ) -> Tuple[str, str]:
        if email_type == "magic_link":
            context_file = settings.email.MAGIC_LINK_HTML_TEMPLATE
            text_file = settings.email.MAGIC_LINK_TEXT_TEMPLATE

        elif email_type == "reset_otp":
            context_file = settings.email.RESET_PASSWORD_HTML_TEMPLATE
            text_file = settings.email.RESET_PASSWORD_TEXT_TEMPLATE
        with open(
            os.path.join(settings.email.TEMPLATE_DIR, context_file),
            "r",
        ) as file:
            html_content = file.read()
        with open(
            os.path.join(settings.email.TEMPLATE_DIR, text_file),
            "r",
        ) as file:
            html_text = file.read()

        self.check_placeholders(html_content, html_text, email_type)
        return html_content, html_text

    @monitor_transaction(op="email.check_placeholders")
    async def check_placeholders(
        self, html_content: str, text_content: str, email_type: Literal["magic_link", "reset_otp"]
    ) -> bool:
        pattern = r"\{\{(.*?)\}\}"
        html_content_placeholders = re.findall(pattern, html_content)
        text_content_placeholders = re.findall(pattern, text_content)
        if html_content_placeholders == [email_type] and text_content_placeholders == [email_type]:
            return True
        else:
            raise ValueError("Placeholders do not match expected values")

    @monitor_transaction(op="email.send")
    async def send_email(
        self, to_email: str, subject: str, body: str, html_content: Optional[str] = None
    ) -> bool:

        message = Mail(
            from_email=self.from_email,
            to_emails=to_email,
            subject=subject,
            plain_text_content=body,
            html_content=html_content or body,
        )
        response: Response = self.sendgrid_client.send(message)

        success: bool = 200 <= response.status_code < 300
        return success

    @monitor_transaction(op="email.send_verification_email")
    async def generate_magic_link_email(self, magic_link: str) -> dict:
        """
        Generate a polished magic link email
        """
        html_content, text_content = await self.get_html_content("magic_link")
        html_content = html_content.replace("{{magic_link}}", magic_link)
        text_content = text_content.replace("{{magic_link}}", magic_link)

        return {"html_content": html_content, "text_content": text_content}

    @monitor_transaction(op="email.send_verification_email")
    async def generate_reset_otp_email(self, reset_otp: str) -> dict:
        """
        Generate a polished magic link email
        """
        html_content, text_content = await self.get_html_content("reset_otp")
        html_content = html_content.replace("{{reset_otp}}", reset_otp)
        text_content = text_content.replace("{{reset_otp}}", reset_otp)

        return {
            "html_content": html_content,
            "text_content": text_content,
            "subject": settings.email.RESET_PASSWORD_SUBJECT,
        }

    @monitor_transaction(op="email.send_verification_email")
    async def send_magic_link_email(self, magic_link: str, email: str) -> bool:
        email_content = await self.generate_magic_link_email(magic_link)
        return await self.send_email(
            to_email=email,
            subject=settings.email.MAGIC_LINK_SUBJECT,
            body=email_content["text_content"],
            html_content=email_content["html_content"],
        )

    @monitor_transaction(op="email.send_verification_email")
    async def send_reset_otp_email(self, otp: str, email: str) -> bool:
        email_content = await self.generate_reset_otp_email(otp)
        return await self.send_email(
            to_email=email,
            subject=settings.email.RESET_PASSWORD_SUBJECT,
            body=email_content["text_content"],
            html_content=email_content["html_content"],
        )
