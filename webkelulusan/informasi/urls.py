from django.urls import path
from .views import *

urlpatterns = [
    path('siswa/search/', search_siswa, name='search-siswa'),
    path('siswa/<int:siswa_id>/generate_skl/', generate_skl, name='generate_skl'),
]