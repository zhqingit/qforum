# Generated by Django 3.0.7 on 2020-07-20 00:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('forum', '0011_statuslog'),
    ]

    operations = [
        migrations.AddField(
            model_name='thread',
            name='status',
            field=models.CharField(default='active', max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='section',
            name='status',
            field=models.CharField(default='active', max_length=50, null=True),
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(default='active', max_length=50, null=True)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to=settings.AUTH_USER_MODEL)),
                ('thread', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='forum.Thread')),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
    ]