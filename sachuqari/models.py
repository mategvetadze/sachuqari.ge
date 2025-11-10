from django.db import models


class Order(models.Model):
    # 👤 Payer info
    payment_name = models.CharField(max_length=120, blank=True, null=True)
    payment_contact = models.CharField(max_length=50, blank=True, null=True)
    iban = models.CharField(max_length=50, blank=True, null=True)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    receipt = models.ImageField(upload_to='', blank=True, null=True)

    # 🎥 Order details
    video_type = models.CharField(max_length=100, blank=True, null=True)
    video_type_other = models.CharField(max_length=100, blank=True, null=True)
    num_people = models.PositiveIntegerField(default=1, blank=True, null=True)

    # 📦 Delivery info
    delivery_method = models.CharField(max_length=50, blank=True, null=True)
    gmail_address = models.CharField(max_length=120, blank=True, null=True)
    other_method = models.CharField(max_length=120, blank=True, null=True)


    def __str__(self):
        return f"🎅 Order #{self.id} by {self.payment_name or 'Unknown'}"


class Child(models.Model):
    # 👶 Child info linked to order
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='children')
    name = models.CharField(max_length=120, blank=True, null=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    message = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name or 'Unnamed'} (Order #{self.order.id})"


class OrderImage(models.Model):
    # 🖼️ Images can link both to order and child
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="images")
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name="images", blank=True, null=True)
    image = models.ImageField(upload_to='', blank=True, null=True)

    def __str__(self):
        child_name = self.child.name if self.child else "Order"
        return f"Image for {child_name} #{self.order.id}"
