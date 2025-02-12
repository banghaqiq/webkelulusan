from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import Siswa

@receiver(post_save, sender=Siswa)
def send_status_notification(sender, instance, **kwargs):
    subject = "Pengumuman Kelulusan SMKNJ"
    message = f"Halo {instance.nama},\nStatus kelulusan Anda: {instance.status}"
    send_mail(
        subject,
        message,
        'raperlu01@gmail.com',
        [instance.email],
        fail_silently=False,
    )