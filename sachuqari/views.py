from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Order, OrderImage,Child
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
import json


@csrf_exempt  # remove this if you add {% csrf_token %} in your form
def home(request):
    if request.method=='POST':
        try:
            # 🧾 Basic order data
            order = Order.objects.create(
                payment_name=request.POST.get("payment_name"),
                payment_contact=request.POST.get("payment_contact"),
                iban=request.POST.get("iban"),
                payment_method=request.POST.get("payment_method"),
                video_type=request.POST.get("videoType"),
                video_type_other=request.POST.get("videoTypeOther"),
                num_people=int(request.POST.get("numPeople", 1)),
                delivery_method=request.POST.get("deliveryMethod"),
                gmail_address=request.POST.get("gmailAddress"),
                other_method=request.POST.get("otherMethod"),
            )

            
            # 👶 Parse and save children
            people_data_raw = request.POST.get("peopleData", "[]")
            people_list = json.loads(people_data_raw)

            for i, child_data in enumerate(people_list, start=1):
                name = child_data.get("name", "")
                age = int(child_data.get("age") or 0)
                message = child_data.get("message", "")
                child = Child.objects.create(order=order, name=name, age=age, message=message)

                # 🖼️ Attach photos for this child
                j = 0
                while True:
                    key = f"person{i}_photo{j}"
                    if key not in request.FILES:
                        break
                    image_file = request.FILES[key]
                    OrderImage.objects.create(order=order, child=child, image=image_file)
                    j += 1
                
                OrderImage.objects.create(order=order, child=child, image=request.POST.get("receipt"))

            return JsonResponse({"success": True, "order_id": order.id})

        except Exception as e:
            print("Error creating order:", e)
            return JsonResponse({"success": False, "error": str(e)}, status=500)
    return render(request,'home.html')

@csrf_exempt
def admin_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('admin_dashboard')
        else:
            return render(request, 'adminlogin.html', {'error': 'მომხმარებელი ან პაროლი არასწორია'})
    return render(request, 'adminlogin.html')

@login_required
def admin_dashboard(request):
    orders = Order.objects.prefetch_related('children__images')
    return render(request, 'admin.html', {'orders': orders})


@require_POST
@login_required
@csrf_exempt
def delete_order(request, order_id):
    Order.objects.filter(id=order_id).delete()
    return redirect('admin_dashboard')