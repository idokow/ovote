from django.http import JsonResponse
from django.shortcuts import render

def main_page(request):
    return render(request,'viewsurvey.html')

def about(request):
    return render(request,'about.html')

def dashboard(request):
    return render(request,'dashboard.html')

def make_new(request):
    return render(request,'makeSurvey.html')

def view_survey(request, surveyID):
    context = {'surveyID' : surveyID}
    return render(request,'survey.html', context)