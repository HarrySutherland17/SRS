# Generated by Django 4.1.4 on 2024-02-25 17:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('srs', '0008_remove_card_review_n'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='review_n',
            field=models.IntegerField(default=0, max_length=200),
        ),
    ]