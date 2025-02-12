# Generated by Django 5.1.5 on 2025-02-09 06:47

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Siswa',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nama', models.CharField(max_length=200)),
                ('tanggal_lahir', models.DateField()),
                ('nisn', models.CharField(max_length=20, unique=True)),
                ('status', models.CharField(choices=[('LULUS', 'LULUS'), ('TIDAK LULUS', 'TIDAK LULUS')], max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
