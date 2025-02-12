from django.urls import path
from .views import *

urlpatterns = [
    path('siswa/<int:siswa_id>/generate_skl/', generate_skl, name='generate_skl'),
    path('cek-kelulusan/', cek_kelulusan, name='cek_kelulusan'),
]