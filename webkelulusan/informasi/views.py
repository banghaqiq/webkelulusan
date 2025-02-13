from django.http import FileResponse
from reportlab.pdfgen import canvas  # type: ignore
from io import BytesIO
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Siswa
from .serializers import SiswaSerializer

class SiswaViewSet(viewsets.ModelViewSet):
    queryset = Siswa.objects.all()
    serializer_class = SiswaSerializer

    @action(detail=True, methods=['delete'])
    def delete_foto(self, request, pk=None):
        siswa = self.get_object()
        siswa.foto.delete()
        return Response({'status': 'foto deleted'})
    
    
@api_view(['GET'])
def search_siswa(request):
    nisn = request.GET.get('nisn', None)
    
    if not nisn:
        return Response({"error": "Parameter NISN diperlukan"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        siswa = Siswa.objects.get(nisn=nisn)  # Cari siswa berdasarkan NISN
        serializer = SiswaSerializer(siswa)   # Serialize data siswa
        return Response(serializer.data)      # Kembalikan data siswa
    except Siswa.DoesNotExist:
        return Response({"error": "Siswa tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def generate_skl(request, siswa_id):
    siswa = Siswa.objects.get(id=siswa_id)
    
    buffer = BytesIO()
    p = canvas.Canvas(buffer)
    
    # Header
    p.setFont("Helvetica-Bold", 18)
    p.drawCentredString(300, 800, "SURAT KETERANGAN LULUS")
    p.setFont("Helvetica", 12)
    p.drawCentredString(300, 780, "SMK NEGERI JAYA")

    # Informasi Siswa
    p.setFont("Helvetica-Bold", 14)
    p.drawString(50, 730, "Nama:")
    p.drawString(50, 710, "NISN:")
    p.drawString(50, 690, "Alamat:")
    p.setFont("Helvetica", 14)
    p.drawString(150, 730, siswa.nama)
    p.drawString(150, 710, siswa.nisn)
    p.drawString(150, 690, siswa.alamat)

    # Status Kelulusan
    p.setFont("Helvetica-Bold", 16)
    p.drawCentredString(300, 650, f"STATUS: {siswa.status}")

    # Footer
    p.setFont("Helvetica", 10)
    p.drawCentredString(300, 50, "Dicetak secara otomatis oleh sistem SKL Online SMKNJ")

    p.showPage()
    p.save()
    
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename='skl.pdf')

