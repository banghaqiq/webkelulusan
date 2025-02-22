from rest_framework import serializers
from .models import Siswa

class SiswaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Siswa
        fields = '__all__'  # Mengembalikan semua field
        read_only_fields = ('created_at', 'updated_at')