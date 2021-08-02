import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn, ValidationErrors, NgForm } from '@angular/forms';
import { AppService } from '../services/app.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { JoineeService } from '../services/joinee.service';
import { first } from 'rxjs/operators';
import Swal from "sweetalert2";
import { MatStepper } from '@angular/material/stepper';
import { LoaderService } from '../services/loader.services';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class PersonalInfoComponent implements OnInit {

  public personal_info: any = {};
  public document_info: any = {};
  isLinear = false;
  personalInfo: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  personalReference: FormGroup;
  professionalReference: FormGroup;
  previousCompanyInformation: FormGroup;
  documentUpload: FormGroup;
  
  photoValid : boolean = false;
  aadharCardValid : boolean = false;
  uploadValue : boolean = false;
  
  myFiles: any = {};
  map: any = [];
  payslip: any = [];
  salary_certificate: any = [];
  previous_company_offer_letter: any = [];
  previous_company_relieving_letter: any = [];
  previous_company_experience_letter: any = [];
  show : boolean = false;
  photoShow : boolean = false;
  aadharCardShow : boolean = false;
  panCardShow : boolean = false;
  passportShow : boolean = false;
  form16Show : boolean = false;
  
  panCardCheckBox : boolean = false;
  passportCheckBox : boolean = false;
  form16CheckBox : boolean = false;
  paySlipCheckBox : boolean = false;
  salaryCertidicateCheckBox : boolean = false;
  offerLetterCheckBox : boolean = false;
  reliveLetterCheckBox : boolean = false;
  experienceLetterCheckBox : boolean = false;

  
  // Map 
  zoom = 12
  center: google.maps.LatLngLiteral
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  }

  
  isShown: boolean = false ;
  payslipreason: boolean = false ;
  pancardreason: boolean = false ;
  passportreason: boolean = false ;
  form16reason: boolean = false ;
  salarycertificatereason: boolean = false ;
  offerletterreason: boolean = false ;
  reliveletterreason: boolean = false ;
  experienceletterreason: boolean = false ;
  
  submitDisable : boolean;
  totalSubmitDisable : boolean = false;

  pancard_reason_required : boolean = false;

  // personal information 
  personalInformationForm = 1
  personalInformationsubmitted = false

  // professional information 
  professionalInformationForm = 1
  professionalInformationsubmitted = false

  // previous company details
  previousCompanyInformationForm = 1
  previousCompanyInformationsubmitted = false

  guid;
  loginData;
  token;

  photo_name;
  aadharCard_name;
  panCard_name;
  passport_name; 
  form16_name;
  paySlip_detail;
  salary_Certificate;
  offer_letter;
  relieving_letter
  experience_letter;

  pancardreasonInfo;
  passportreasonInfo;
  form16reasonInfo;
  paySlipreasonInfo;
  salarycertificatereasonInfo;
  offerletterreasonInfo;
  relievingletterreasonInfo;
  experienceletterreasonInfo;

  marital_status_value;

  today = new Date();
  dd = this.today.getDate();
  mm = this.today.getMonth() + 1; //January is 0!
  set_date;
  set_month;
  max_date;

  @ViewChild('myForm') myForm: NgForm;

  constructor(
      private _formBuilder: FormBuilder,
      private _appApi : AppService,
      private service : JoineeService,
      private route : ActivatedRoute,
      private router : Router,
      private loaderService: LoaderService,
    ) {}

  ngOnInit() {

    this.loaderService.isLoading.next(false);
    this.route.params.subscribe((params: Params) => {
      this.guid = params.id;
    });
    
     /* Check the url expire **/
     this.loaderService.isLoading.next(true);
     this.service.checkurl(this.guid)
     .pipe(first())
     .subscribe(
       urlexpire => {
        this.loaderService.isLoading.next(false);
         if(urlexpire.data == "Url is expired" || urlexpire.data == "Url is not activated yet" || urlexpire.data == "Guid cannot be found"){
            this.router.navigateByUrl('404');
         }
       },
       error =>
       {
        this.loaderService.isLoading.next(false);
       }
     );

     /** Age restriction for DOB */
       
      // this.max_date = new Date (2017, 1, 1);
      var yyyy = this.today.getFullYear() -18;
      this.set_date = this.dd;
      if (this.dd < 10) {
         this.set_date = '0' + this.dd;
      } 
      this.set_month = this.mm;
      if (this.mm < 10) {
        this.set_month = '0' + this.mm;
      } 
      this.max_date = new Date (yyyy, this.set_month, this.set_date);

    /* list out the candidateDetails from the DB **/
    this.service.getCandidateDetails(this.guid)
    .pipe(first())
    .subscribe(
      CandidateDetails => {
        this.personal_info = CandidateDetails["data"][0];
        
        if(this.personal_info){
          this.personal_info['first_name'] = this.personal_info['name'];
        }
      }
    );

    /* list out the joineeDetails from the DB **/
    this.getDetails();

     /* check joinee details from the DB **/
    this.checkJoineeDetails();

    this.personalInfo = this._formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contact_number: ['', Validators.required],
      alternate_number: ['', Validators.required],
      father_name: ['', Validators.required],
      father_contact_number: [''],
      mother_name: ['', Validators.required],
      mother_contact_number: [''],
      present_address: ['', Validators.required],
      permanent_address: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      date_of_join: ['', Validators.required],
      blood_group: [''],
      email: ['', Validators.required],
      landmark: [''],
      uan_no: [''],
      marital_status: [''],
      spouse_name: [''],
      spouse_contact_number: [''],
      spouse_dob: [''],
      childDetails : new FormArray([])
    });
    this.personalReference = this._formBuilder.group({
      personalInformation : new FormArray([])
    });
    this.personalReference = this._formBuilder.group({
      personalInformation : new FormArray([])
    });
    this.professionalReference = this._formBuilder.group({
      professionalInformation : new FormArray([])
    });
    this.previousCompanyInformation = this._formBuilder.group({
      previousCompanyInformation : new FormArray([])
    });
    this.documentUpload = this._formBuilder.group({
      photo: ['', Validators.required],
      aadhar_card: ['', Validators.required],
      pan_card: [''],
      pancard_check_box: [''],
      pancard_text_area: [''],
      passport: [''],
      passport_check_box: [''],
      passport_text_area: [''],
      form_16: [''],
      form16_check_box: [''],
      form16_text_area: [''],
      pay_slips: [''],
      payslip_check_box: [''],
      payslip_text_area: [''],
      salary_certificate: [''],
      salary_certificate_check_box: [''],
      salary_certificate_text_area: [''],
      offer_letter: [''],
      offer_letter_check_box: [''],
      offer_letter_text_area: [''],
      relieve_letter: [''],
      relieve_letter_check_box: [''],
      relieve_letter_text_area: [''],
      experience_letter: [''],
      experience_letter_check_box: [''],
      experience_letter_text_area: [''],
    });


    this.onAddChildDetails();
    this.onAddPersonalInformation();
    this.onAddProfessionalInformation();
    this.onAddPreviousCompanyInformation();

  }


  /* list out the joineeDetails from the DB **/
  getDetails(){
    this.totalSubmitDisable = false;
    /* check the status of is_link disabled is from the DB **/
    this.service.CheckJoineeDetailslinkStatus(this.guid)
     .pipe(first())
     .subscribe(
       isLinkDisabled => {
        if(isLinkDisabled['data'] == 1){
          this.totalSubmitDisable = true;
        }
       });

     this.service.getJoineeInfoDetails(this.guid)
     .pipe(first())
     .subscribe(
       getJoineeInfoDetails => {
         let InfoDetails = getJoineeInfoDetails["data"];
           if(InfoDetails["joinee_personal_info"] != ""){
             this.personal_info = InfoDetails.joinee_personal_info[0];
             this.marital_status_value = this.personal_info["marital_status"].toString();
             if(this.personal_info["marital_status"] != 0){
               this.open();
 
               let childDetailArray = InfoDetails["joinee_child_info"];
 
               const s1 = this.personalInfo.controls
               .childDetails as FormArray;
               
               if(childDetailArray.length > 0){
                // this.onRemoveChildDetails(0);
                 for(let i = 0 ; i <= childDetailArray.length ; i++){
                  this.onRemoveChildDetailsReset();
                 }
               } 
              
 
               childDetailArray.forEach((elem: { child_name: any; child_gender: any; child_dob: any; }) => {
                 s1.push(
                   this._formBuilder.group({
                     child_name: [elem.child_name],
                     child_gender: [elem.child_gender],
                     child_dob: [elem.child_dob]
                   })
                 );
               });
             }
           }
           if(InfoDetails["joinee_personal_reference"] != ""){
             let personalInformationsArray = InfoDetails["joinee_personal_reference"];
 
                 const t3 = this.personalReference.controls
                 .personalInformation as FormArray;
                //  this.onRemovePersonalInformation(0);
                 this.onRemovePersonalInformationReset();

 
                 personalInformationsArray.forEach((elem: { name: any; designation: any; company_name: any; phone_no: any; email: any; relation: any; }) => {
                   t3.push(
                     this._formBuilder.group({
                       name: [elem.name],
                       designation: [elem.designation],
                       company_name: [elem.company_name],
                       phone_no: [elem.phone_no],
                       email: [elem.email],
                       relation: [elem.relation]
                     })
                   );
                 });
           }
           if(InfoDetails["joinee_professional_reference"] != ""){
             let professionalInformationsArray = InfoDetails["joinee_professional_reference"];
 
             const t1 = this.professionalReference.controls
             .professionalInformation as FormArray;
            //  this.onRemoveProfessionalInformation(0);
             this.onRemoveProfessionalInformationReset();
 
             professionalInformationsArray.forEach((elem: { name: any; designation: any; company_name: any; phone_no: any; email: any; relation: any; }) => {
               t1.push(
                 this._formBuilder.group({
                   name: [elem.name],
                   designation: [elem.designation],
                   company_name: [elem.company_name],
                   phone_no: [elem.phone_no],
                   email: [elem.email],
                   relation: [elem.relation]
                 })
               );
             });
           }
           if(InfoDetails["joinee_previous_company"] != ""){
             let previousCompanyInformationArray = InfoDetails["joinee_previous_company"];
 
             const t2 = this.previousCompanyInformation.controls
             .previousCompanyInformation as FormArray;
            //  this.onRemovePreviousCompanyInformation(0);
             this.onAddPreviousCompanyInformationReset();
 
             previousCompanyInformationArray.forEach((elem: { hr_name: any; hr_designation: any; hr_phone_no: any; hr_email: any;
               ra_name: any; ra_designation: any; ra_phone_no: any; ra_email: any; }) => {
               t2.push(
                 this._formBuilder.group({
                   hr_name: [elem.hr_name],
                   hr_designation: [elem.hr_designation],
                   hr_phone_no: [elem.hr_phone_no],
                   hr_email: [elem.hr_email],
                   ra_name: [elem.ra_name],
                   ra_designation: [elem.ra_designation],
                   ra_phone_no: [elem.ra_phone_no],
                   ra_email: [elem.ra_email]
                 })
               );
             });
           }
           if(InfoDetails["joinee_documents"] != ""){
             this.document_info = InfoDetails["joinee_documents"];
               /* show photo detail **/
             let photo_detail = this.document_info.filter((x: { type: any; }) => x.type == 1 );
             this.photo_name = photo_detail[0]['file_name'];
             this.photoShow = this.photo_name ? true : false;
             this.photoValid = this.photo_name ? true : false;
             
 
             let aadharCard_detail = this.document_info.filter((x: { type: any; }) => x.type == 2 );
             this.aadharCard_name = aadharCard_detail[0]['file_name'];
             this.aadharCardShow = this.aadharCard_name ? true : false;
             this.aadharCardValid = this.aadharCard_name ? true : false;

             if( this.photo_name != "" && this.aadharCard_name != "")
             {
               this.uploadValue = true;
             }
             else{
              this.uploadValue = this.documentUpload.valid;
             }
 
               /* show panCard detail **/
             let panCard_detail = this.document_info.filter((x: { type: any; }) => x.type == 3 );
             if(panCard_detail.length < 2 && panCard_detail != ""){
               let check_box_detail = panCard_detail[0]['check_box'].toString();
               if(check_box_detail == 1){
                   this.panCardCheckBox = check_box_detail == 1 ? true : false;
                   this.pancardreason = this.panCardCheckBox == true ? true : false ;
                   this.pancardreasonInfo = this.panCardCheckBox == true ?  panCard_detail[0]['reason'] : '';
                   this.panCard_name = '';
                    this.panCardShow = false;
               }
               else{
                 this.panCard_name = panCard_detail[0]['file_name'];
                 this.panCardShow = this.panCard_name ? true : false;
                 this.panCardCheckBox = false;
                   this.pancardreason =  false ;
                   this.pancardreasonInfo = '';
               }
             }
 
               /* show passport detail **/
             let passport_detail = this.document_info.filter((x: { type: any; }) => x.type == 4 );
             if(passport_detail.length < 2 && passport_detail != ""){
               let check_box_detail = passport_detail[0]['check_box'].toString();
               if(check_box_detail == 1){
                   this.passportCheckBox = check_box_detail == 1 ? true : false;
                   this.passportreason = this.passportCheckBox == true ? true : false ;
                   this.passportreasonInfo = this.passportCheckBox == true ?  passport_detail[0]['reason'] : '';
                   this.passport_name = '';
                   this.passportShow =  false;
               }
               else{
                 this.passport_name = passport_detail[0]['file_name'];
                 this.passportShow = this.passport_name ? true : false;
                 this.passportCheckBox =  false;
                   this.passportreason = false ;
                   this.passportreasonInfo = '';
               }
             }
             
               /* show form16 detail **/
             let form16_detail = this.document_info.filter((x: { type: any; }) => x.type == 8 );
             if(form16_detail.length < 2 && form16_detail!= ""){
               let check_box_detail = form16_detail[0]['check_box'].toString();
               if(check_box_detail == 1){
                   this.form16CheckBox = check_box_detail == 1 ? true : false;
                   this.form16reason = this.form16CheckBox == true ? true : false ;
                   this.form16reasonInfo = this.form16CheckBox == true ?  form16_detail[0]['reason'] : '';
                   this.form16_name = '';
                    this.form16Show = false;
               }
               else{
                 this.form16_name = form16_detail[0]['file_name'];
                 this.form16Show = this.form16_name ? true : false;
                 this.form16CheckBox = false;
                   this.form16reason = false ;
                   this.form16reasonInfo =  '';
               }
             }
 
               /* show paySlip detail **/
             let get_paySlip_detail = this.document_info.filter((x: { type: any; }) => x.type == 9 );
             if(get_paySlip_detail.length < 2 && get_paySlip_detail != ""){
               let check_box_detail = get_paySlip_detail[0]['check_box'].toString();
               if(check_box_detail == 1){
                 this.paySlipCheckBox = check_box_detail == 1 ? true : false;
                 this.payslipreason = this.paySlipCheckBox == true ? true : false ;
                 this.paySlipreasonInfo = this.paySlipCheckBox == true ? get_paySlip_detail[0]['reason'] : '';
                //  this.paySlip_detail = ""
               }else{
                 this.paySlip_detail = this.document_info.filter((x: { type: any; }) => x.type == 9 );
                 this.paySlipCheckBox =  false;
                 this.payslipreason =  false ;
                 this.paySlipreasonInfo = '';
               }
 
             }else{
                 this.paySlip_detail = this.document_info.filter((x: { type: any; }) => x.type == 9 );
                 this.paySlipCheckBox =  false;
                 this.payslipreason =  false ;
                 this.paySlipreasonInfo = '';
               }
 
               /* show salary_certificate detail **/
             let salary_certificate_detail = this.document_info.filter((x: { type: any; }) => x.type == 10 );
             if(salary_certificate_detail.length < 2 && salary_certificate_detail != ""){
               let check_box_detail = salary_certificate_detail[0]['check_box'].toString();
               if(check_box_detail == 1){
                 this.salaryCertidicateCheckBox = check_box_detail == 1 ? true : false;
                 this.salarycertificatereason = this.salaryCertidicateCheckBox == true ? true : false ;
                 this.salarycertificatereasonInfo = this.salaryCertidicateCheckBox == true ? salary_certificate_detail[0]['reason'] : '';
                //  this.salary_Certificate = "";
                }else{
                 this.salary_Certificate = salary_certificate_detail;
                 this.salaryCertidicateCheckBox = false;
                 this.salarycertificatereason =  false ;
                 this.salarycertificatereasonInfo = '';
               }
             }else{
               this.salary_Certificate = salary_certificate_detail;
               this.salaryCertidicateCheckBox = false;
               this.salarycertificatereason =  false ;
               this.salarycertificatereasonInfo = '';
             }
 
               /* show offer_letter detail **/
             let get_offer_letter = this.document_info.filter((x: { type: any; }) => x.type == 5 );
             if(get_offer_letter.length < 2 && get_offer_letter != ""){
               let check_box_detail = get_offer_letter[0]['check_box'].toString();
               if(check_box_detail == 1){
                 this.offerLetterCheckBox = check_box_detail == 1 ? true : false;
                 this.offerletterreason = this.offerLetterCheckBox == true ? true : false ;
                 this.offerletterreasonInfo = this.offerLetterCheckBox == true ? get_offer_letter[0]['reason'] : '';
                //  this.offer_letter =  "";
               }else{
                 this.offer_letter = get_offer_letter;
                   this.offerLetterCheckBox = false;
                 this.offerletterreason = false ;
                 this.offerletterreasonInfo = '';
                 }
             }else{
                 this.offer_letter = get_offer_letter;
                 this.offerLetterCheckBox = false;
               this.offerletterreason = false ;
               this.offerletterreasonInfo = '';
               }
 
               /* show relieving_letter detail **/
             let relieving_letter_detail = this.document_info.filter((x: { type: any; }) => x.type == 6 );
             if(relieving_letter_detail.length < 2 && relieving_letter_detail != ""){
               let check_box_detail = relieving_letter_detail[0]['check_box'].toString();
               if(check_box_detail == 1){
                 this.reliveLetterCheckBox = check_box_detail == 1 ? true : false;
                 this.reliveletterreason = this.reliveLetterCheckBox == true ? true : false ;
                 this.relievingletterreasonInfo = this.reliveLetterCheckBox == true ? relieving_letter_detail[0]['reason'] : '';
                //  this.relieving_letter = "";
               }else{
                 this.relieving_letter = relieving_letter_detail;
                   this.reliveLetterCheckBox =  false;
                   this.reliveletterreason =  false ;
                   this.relievingletterreasonInfo =  '';
               }
             }else{
                   this.relieving_letter = relieving_letter_detail;
                   this.reliveLetterCheckBox =  false;
                   this.reliveletterreason =  false ;
                   this.relievingletterreasonInfo =  '';
               }
 
               /* show experience_letter detail **/
             let experience_letter_detail = this.document_info.filter((x: { type: any; }) => x.type == 7 );
             if(experience_letter_detail.length < 2 && experience_letter_detail != ""){
               let check_box_detail = experience_letter_detail[0]['check_box'].toString();
               if(check_box_detail == 1){
                 this.experienceLetterCheckBox = check_box_detail == 1 ? true : false;
                 this.experienceletterreason = this.experienceLetterCheckBox == true ? true : false ;
                 this.experienceletterreasonInfo = this.experienceLetterCheckBox == true ? experience_letter_detail[0]['reason'] : '';
                //  this.experience_letter = "";
               }else{
                 this.experience_letter = experience_letter_detail;
                 this.experienceLetterCheckBox = false;
                 this.experienceletterreason =  false ;
                 this.experienceletterreasonInfo =  '';
               }
             }else{
                   this.experience_letter = experience_letter_detail;
                   this.experienceLetterCheckBox = false;
                   this.experienceletterreason =  false ;
                   this.experienceletterreasonInfo =  '';
               }
           }
         }
     );
  }

  /* check joinee details from the DB **/
  checkJoineeDetails(){
    this.submitDisable = true;
    this.service.CheckJoineeDetails(this.guid)
    .pipe(first())
    .subscribe(
      joineeDetails => {
        if (joineeDetails.data == "All details filled") {
          this.submitDisable = false;
        }
      }
    );
  }

  // Spouse Information Actions
  get s() { return this.personalInfo.controls; }
  get s1() { return this.s.childDetails as FormArray; }

  // While adding new Form Dynamically
  onAddChildDetails() {
    this.s1.push(this._formBuilder.group({
      child_name: [''],
      child_gender: [''],
      child_dob: [''],
    }));
  }

  // While removing existing Form
  onRemoveChildDetails(data){
    this.s1.removeAt(data);
  }

  onRemoveChildDetailsReset() {
    // reset whole form back to initial state
    this.s1.clear();
  }

  // Personal Information Actions
  get f() { return this.personalReference.controls; }
  get t3() { return this.f.personalInformation as FormArray; }

  // While adding new Form Dynamically
  onAddPersonalInformation() {
    // console.log('hi123');
    
    this.t3.push(this._formBuilder.group({
        name: ['', Validators.required],
        designation: ['', Validators.required],
        company_name: ['', Validators.required],
        phone_no: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        relation: ['', Validators.required]
    }));
  }

  // While removing existing Form
  onRemovePersonalInformation(data){
    this.t3.removeAt(data);
  }

  onRemovePersonalInformationReset() {
    // reset whole form back to initial state
    this.t3.clear();
  }

  // Professional Information Actions
  get f1() { return this.professionalReference.controls; }
  get t1() { return this.f1.professionalInformation as FormArray; }

  // While adding new Form Dynamically
  onAddProfessionalInformation() {
    this.t1.push(this._formBuilder.group({
        name: ['', Validators.required],
        designation: ['', Validators.required],
        company_name: ['', Validators.required],
        phone_no: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        relation: ['', Validators.required]
    }));
  }

  // While removing existing Form
  onRemoveProfessionalInformation(data){
    this.t1.removeAt(data);
  }

  onRemoveProfessionalInformationReset() {
    // reset whole form back to initial state
    this.t1.clear();
  }

  // Previous Company Informations Actions
  get f2() { return this.previousCompanyInformation.controls; }
  get t2() { return this.f2.previousCompanyInformation as FormArray; }

  // While adding new Form Dynamically
  onAddPreviousCompanyInformation() {
    this.t2.push(this._formBuilder.group({
        hr_name: ['', Validators.required],
        hr_designation: ['', Validators.required],
        hr_phone_no: ['', Validators.required],
        hr_email: ['', [Validators.required, Validators.email]],
        ra_name: ['', Validators.required],
        ra_designation: ['', Validators.required],
        ra_phone_no: ['', Validators.required],
        ra_email: ['', [Validators.required, Validators.email]]
    }));
  }

  // While removing existing Form
  onRemovePreviousCompanyInformation(data){
    this.t2.removeAt(data);
  }

  // to rest the Form
  onAddPreviousCompanyInformationReset() {
    // reset whole form back to initial state
    this.t2.clear();
  }

  // To clear form data
  onAddPreviousCompanyInformationClear() {
      // clear errors and reset ticket fields
      this.previousCompanyInformationsubmitted = false;
      this.t2.reset();
  }

  /* Save the all the details in db **/
  UploadAllDetails(){
    this.totalSubmitDisable = false;
    // this.personalInfoSubmit();
    // this.personalReferenceSubmit();
    // this.professionalReferenceSubmit();
    // this.previousCompanyInformationSubmit();
    // this.documentUploadSubmit();

    let formdata = new FormData();
    formdata.append("guid", this.guid);

    this.loaderService.isLoading.next(true);
    this.service
          .addJoineeAllDetails(formdata)
          .pipe(first())
          .subscribe(
            data => {
              this.loaderService.isLoading.next(false);

              Swal.fire({
                title: 'Thanks For Submitting all the Data!!!',
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                }
              })
              
              /* list out the joineeDetails from the DB **/
              this.getDetails()
            },
            error => {
              this.loaderService.isLoading.next(false);
            }
          );
  }

  /* Save the personal info **/
  personalInfoSubmit(){
    let formdata = new FormData();
    formdata.append("guid", this.guid);
    for (const key in this.personalInfo["value"]) {
      if (key == "childDetails") {
        this.personalInfo["value"][key].forEach((elem: { [x: string]: string; }, index: string) => {
          formdata.append(
            "childDetails[" + index + "][child_name]",
            elem["child_name"]
          );
          formdata.append(
            "childDetails[" + index + "][child_gender]",
            elem["child_gender"]
          );
          formdata.append(
            "childDetails[" + index + "][child_dob]",
            elem["child_dob"]
          );
        });
      } else {
        formdata.append(key, this.personalInfo["value"][key]);
      }
    }
    this.loaderService.isLoading.next(true);
    this.service
          .addJoineeDetails(formdata)
          .pipe(first())
          .subscribe(
            data => {
              this.loaderService.isLoading.next(false);
              
              /** Sweet alert message */
              let timerInterval
                Swal.fire({
                  title: 'Data Has been saved!',
                  html: '',
                  timer: 2000,
                  timerProgressBar: true,
                  onBeforeOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                      const content = Swal.getContent()
                    }, 100)
                  },
                  onClose: () => {
                    clearInterval(timerInterval)
                  }
                });
      
              /* check joinee details from the DB **/
               this.checkJoineeDetails();

              /* list out the joineeDetails from the DB **/
               this.getDetails()
            },
            error => {
              this.loaderService.isLoading.next(false);
            }
          );
  }

  personalReferenceSubmit(){
    let formdata = new FormData();
    formdata.append("guid", this.guid);
    for (const key in this.personalReference["value"]) {
      if (key == "personalInformation") {
        this.personalReference["value"][key].forEach((elem: { [x: string]: string; }, index: string) => {
          formdata.append(
            "personalInformation[" + index + "][name]",
            elem["name"]
          );
          formdata.append(
            "personalInformation[" + index + "][designation]",
            elem["designation"]
          );
          formdata.append(
            "personalInformation[" + index + "][company_name]",
            elem["company_name"]
          );
          formdata.append(
            "personalInformation[" + index + "][phone_no]",
            elem["phone_no"]
          );
          formdata.append(
            "personalInformation[" + index + "][email]",
            elem["email"]
          );
          formdata.append(
            "personalInformation[" + index + "][relation]",
            elem["relation"]
          );
        });
      } else {
        formdata.append(key, this.personalReference["value"][key]);
      }
    }
    this.loaderService.isLoading.next(true);
    this.service
          .addJoineePersonalReferenceDetails(formdata)
          .pipe(first())
          .subscribe(
            data => {
              this.loaderService.isLoading.next(false);
              
              /** Sweet alert message */
              let timerInterval
                Swal.fire({
                  title: 'Data Has been saved!',
                  html: '',
                  timer: 2000,
                  timerProgressBar: true,
                  onBeforeOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                      const content = Swal.getContent()
                    }, 100)
                  },
                  onClose: () => {
                    clearInterval(timerInterval)
                  }
                });
      
              /* check joinee details from the DB **/
               this.checkJoineeDetails();

              /* list out the joineeDetails from the DB **/
               this.getDetails()
            },
            error => {
              this.loaderService.isLoading.next(false);
            }
          );
  }

  professionalReferenceSubmit(){
    let formdata = new FormData();
    formdata.append("guid", this.guid);
    for (const key in this.professionalReference["value"]) {
      if (key == "professionalInformation") {
        this.professionalReference["value"][key].forEach((elem: { [x: string]: string; }, index: string) => {
          formdata.append(
            "professionalInformation[" + index + "][name]",
            elem["name"]
          );
          formdata.append(
            "professionalInformation[" + index + "][designation]",
            elem["designation"]
          );
          formdata.append(
            "professionalInformation[" + index + "][company_name]",
            elem["company_name"]
          );
          formdata.append(
            "professionalInformation[" + index + "][phone_no]",
            elem["phone_no"]
          );
          formdata.append(
            "professionalInformation[" + index + "][email]",
            elem["email"]
          );
          formdata.append(
            "professionalInformation[" + index + "][relation]",
            elem["relation"]
          );
        });
      } else {
        formdata.append(key, this.professionalReference["value"][key]);
      }
    }
    this.loaderService.isLoading.next(true);
    this.service
          .addJoineeProfessionalReferenceDetails(formdata)
          .pipe(first())
          .subscribe(
            data => {
              this.loaderService.isLoading.next(false);
              
              /** Sweet alert message */
              let timerInterval
                Swal.fire({
                  title: 'Data Has been saved!',
                  html: '',
                  timer: 2000,
                  timerProgressBar: true,
                  onBeforeOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                      const content = Swal.getContent()
                    }, 100)
                  },
                  onClose: () => {
                    clearInterval(timerInterval)
                  }
                });
      
              /* check joinee details from the DB **/
               this.checkJoineeDetails();

              /* list out the joineeDetails from the DB **/
               this.getDetails();
            },
            error => {
              this.loaderService.isLoading.next(false);
            }
          );
  }

  previousCompanyInformationSubmit(){

    let formdata = new FormData();
    formdata.append("guid", this.guid);
    for (const key in this.previousCompanyInformation["value"]) {
      if (key == "previousCompanyInformation") {
        this.previousCompanyInformation["value"][key].forEach((elem: { [x: string]: string; }, index: string) => {
          formdata.append(
            "previousCompanyInformation[" + index + "][hr_name]",
            elem["hr_name"]
          );
          formdata.append(
            "previousCompanyInformation[" + index + "][hr_designation]",
            elem["hr_designation"]
          );
          formdata.append(
            "previousCompanyInformation[" + index + "][hr_phone_no]",
            elem["hr_phone_no"]
          );
          formdata.append(
            "previousCompanyInformation[" + index + "][hr_email]",
            elem["hr_email"]
          );
          formdata.append(
            "previousCompanyInformation[" + index + "][ra_name]",
            elem["ra_name"]
          );
          formdata.append(
            "previousCompanyInformation[" + index + "][ra_designation]",
            elem["ra_designation"]
          );
          formdata.append(
            "previousCompanyInformation[" + index + "][ra_phone_no]",
            elem["ra_phone_no"]
          );
          formdata.append(
            "previousCompanyInformation[" + index + "][ra_email]",
            elem["ra_email"]
          );
        });
      } else {
        formdata.append(key, this.previousCompanyInformation["value"][key]);
      }
    }
    this.loaderService.isLoading.next(true);
    this.service
          .addJoineePreviousCompanyDetails(formdata)
          .pipe(first())
          .subscribe(
            data => {
              this.loaderService.isLoading.next(false);

              /** Sweet alert message */
              let timerInterval
                Swal.fire({
                  title: 'Data Has been saved!',
                  html: '',
                  timer: 2000,
                  timerProgressBar: true,
                  onBeforeOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                      const content = Swal.getContent()
                    }, 100)
                  },
                  onClose: () => {
                    clearInterval(timerInterval)
                  }
                });
      
              /* check joinee details from the DB **/
               this.checkJoineeDetails();

              /* list out the joineeDetails from the DB **/
              this.getDetails();
            },
            error => {
              this.loaderService.isLoading.next(false);
            }
          );

  }

  onFileSelected(fileInput: any,key: string){
    for (var i = 0; i < fileInput.length; i++) {
      if(key == "photo"){
        this.photo_name = fileInput[0]['name'];
        fileInput[i].fileName = "photo";
        this.myFiles['photo'] = fileInput[i];
      }
      if(key == "aadhar_card"){
        this.aadharCard_name = fileInput[0]['name'];
        fileInput[i].fileName = "aadhar_card";
        this.myFiles['aadhar_card'] = fileInput[i];
      }
      if(key == "pan_card"){
        this.panCard_name = fileInput[0]['name'];
        fileInput[i].fileName = "pan_card";
        this.myFiles['pan_card'] = fileInput[i];
      }
      if(key == "passport"){
        this.passport_name = fileInput[0]['name'];
        fileInput[i].fileName = "passport";
        this.myFiles['passport'] = fileInput[i];
       }
      if(key == "form_16"){
        this.form16_name = fileInput[0]['name'];
        fileInput[i].fileName = "form16";
        this.myFiles['form16'] = fileInput[i];
      }
      if(key == "pay_slips"){
        this.payslip =[];
        for (var i = 0; i < fileInput.length; i++) {
          fileInput[i].fileName = "payslip";
          this.payslip.push(fileInput[i]);
        }
        this.myFiles['payslip'] = this.payslip;
      }
      if(key == "salary_certificate"){
        this.salary_certificate =[];
        for (var i = 0; i < fileInput.length; i++) {
          fileInput[i].fileName = "salary_certificate";
          this.salary_certificate.push(fileInput[i]);
        }
        this.myFiles['salary_certificate'] = this.salary_certificate;
       }
       if(key == "offer_letter"){
        this.previous_company_offer_letter =[];
        for (var i = 0; i < fileInput.length; i++) {
          fileInput[i].fileName = "offer_letter";
          this.previous_company_offer_letter.push(fileInput[i]);
        }
        this.myFiles['offer_letter'] = this.previous_company_offer_letter;
       }
       if(key == "relieve_letter"){
        this.previous_company_relieving_letter =[];
        for (var i = 0; i < fileInput.length; i++) {
          fileInput[i].fileName = "relieve_letter";
          this.previous_company_relieving_letter.push(fileInput[i]);
        }
        this.myFiles['relieve_letter'] = this.previous_company_relieving_letter;
       }
       if(key == "experience_letter"){
        this.previous_company_experience_letter =[];
        for (var i = 0; i < fileInput.length; i++) {
          fileInput[i].fileName = "experience_letter";
          this.previous_company_experience_letter.push(fileInput[i]);
        }
        this.myFiles['experience_letter'] = this.previous_company_experience_letter;
       }
    }
    if(this.myFiles.hasOwnProperty('photo') && this.myFiles.hasOwnProperty('aadhar_card')){
      this.uploadValue = true;
    }
  }

  documentUploadSubmit(){
    const formData = new FormData();
    formData.append("guid", this.guid);
    for (const key in this.documentUpload["value"]) {
      if (key == "photo") {
        let photo = this.myFiles['photo'];
        
        if(photo){
            formData.append("photo", photo);
      }
      else{
        formData.append("photo", null);
      }
      } 
      else if(key == "aadhar_card") {
        let aadhar_card = this.myFiles["aadhar_card"];
        if(aadhar_card){
          formData.append("aadhar_card", aadhar_card);
      }
      else{
        formData.append("aadhar_card", null);
      }
      } 
      else if(key == "pan_card") {
        let pan_card = this.myFiles["pan_card"];
        if(pan_card){
          formData.append("pan_card", pan_card);
      }
      else{
        formData.append("pan_card", null);
      }
      } 
      else if(key == "passport") {
        let passport = this.myFiles["passport"];
        if(passport){
          formData.append("passport", passport);
      }
      else{
        formData.append("passport", null);
      }
      } 
      else if(key == "form_16") {
        let form16 = this.myFiles["form16"];
        if(form16){
          formData.append("form_16", form16);
      }
      else{
        formData.append("form_16", null);
      }
      } 
      else if(key == "pay_slips") {
        let payslip = this.myFiles["payslip"];
        if(payslip){
        for (var i = 0; i < payslip.length; i++) {
          formData.append("pay_slips[]", payslip[i]);
        }
      }
      else{
        formData.append("pay_slips", null);
      }
      }  
      else if(key == "salary_certificate") {
        let salary_certificate = this.myFiles["salary_certificate"];
        if(salary_certificate){
        for (var i = 0; i < salary_certificate.length; i++) {
          formData.append("salary_slip[]", salary_certificate[i]);
        }
      }
      else{
        formData.append("salary_slip", null);
      }
      }  
      else if(key == "offer_letter") {
        let offer_letter = this.myFiles["offer_letter"];
        if(offer_letter){
        for (var i = 0; i < offer_letter.length; i++) {
          formData.append("offer_letter[]", offer_letter[i]);
        }
      }
      else{
        formData.append("offer_letter", null);
      }
      }  
      else if(key == "relieve_letter") {
        let relieve_letter = this.myFiles["relieve_letter"];
        if(relieve_letter){
        for (var i = 0; i < relieve_letter.length; i++) {
          formData.append("relieve_letter[]", relieve_letter[i]);
        }
      }
      else{
        formData.append("relieve_letter", null);
      }
      }  
      else if(key == "experience_letter") {
        let experience_letter = this.myFiles["experience_letter"];
        if(experience_letter){
        for (var i = 0; i < experience_letter.length; i++) {
          formData.append("experience_letter[]", experience_letter[i]);
        }
      }
      else{
        formData.append("experience_letter", null);
      }
      } 
      else {
        formData.append(key, this.documentUpload["value"][key]);
      }
    }
    this.loaderService.isLoading.next(true);
    this.service
    .addJoineeDocumentDetails(
      formData,
    )
    .pipe(first())
    .subscribe(data => {
      this.loaderService.isLoading.next(false);

              
      /** Sweet alert message */
      let timerInterval
        Swal.fire({
          title: 'Document Has been saved!',
          html: '',
          timer: 2000,
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
              const content = Swal.getContent()
            }, 100)
          },
          onClose: () => {
            clearInterval(timerInterval)
          }
        });

      /* check joinee details from the DB **/
       this.checkJoineeDetails();

       /* list out the joineeDetails from the DB **/
       this.getDetails();
      },
      error => {
        this.loaderService.isLoading.next(false);
      }
    );
  }

  deleteDocument(id) {
    if (id != "" ) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.loaderService.isLoading.next(true);
          this.service
          .deleteDocument(id)
          .pipe(first())
          .subscribe(
            data => {
              this.loaderService.isLoading.next(false);
               /* check joinee details from the DB **/
                this.checkJoineeDetails();

               /* list out the joineeDetails from the DB **/
              this.getDetails();
            },
            error => {
              this.loaderService.isLoading.next(false);
            }
          );
        }
      })
    }
  }

  open()
  {
    this.isShown = true;
  }
  
  close()
  {
    this.isShown = false;
  }

  pancardcheckbox(event){
    this.pancardreason = event.checked == true ? true : false ;

    // let pancard_event = event.name;
    // let check = document.getElementsByName(pancard_event + "_reason").value = "Paragraph changed!";
    if(event.checked == true){
      this.myForm.form.get('pancard_text_area').setValidators(Validators.required);
      this.myForm.form.get('pancard_text_area').updateValueAndValidity();
      // this.uploadValue = false;
      }else{
        this.myForm.form.get('pancard_text_area').clearValidators();
        this.myForm.form.get('pancard_text_area').updateValueAndValidity();
        // if(this.myFiles.hasOwnProperty('photo') && this.myFiles.hasOwnProperty('aadhar_card')){
        //   this.uploadValue = true;
        // }
      }
}
  passportcheckbox(event){
    this.passportreason = event == true ? true : false ;
  }
  form16checkbox(event){
    this.form16reason = event == true ? true : false ;
  }
  payslipcheckbox(event){
    this.payslipreason = event == true ? true : false ;
  }
  salarycertificatecheckbox(event){
    this.salarycertificatereason = event == true ? true : false ;
  }
  offerlettercheckbox(event){
    this.offerletterreason = event == true ? true : false ;
  }
  relivelettercheckbox(event){
    this.reliveletterreason = event == true ? true : false ;
  }
  experiencelettercheckbox(event){
    this.experienceletterreason = event == true ? true : false ;
  }

}
