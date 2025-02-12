from django.db import models
from django.core.validators import RegexValidator

class Siswa(models.Model):
    nama = models.CharField(max_length=200)
    tanggal_lahir = models.DateField()
    nisn = models.CharField(
        max_length=20, 
        unique=True,
        validators=[
            RegexValidator(
                regex='^[0-9]*$',
                message='NISN harus berupa angka'
            )
        ]
    )
    status = models.CharField(max_length=20, choices=[
        ('LULUS', 'LULUS'), 
        ('TIDAK LULUS', 'TIDAK LULUS')
    ])
    foto = models.ImageField(upload_to='siswa/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nama