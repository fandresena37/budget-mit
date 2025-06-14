import { Prevision } from "./Prevision";

export class Depense extends Prevision {
    constructor(
      public categorie: string,
      public beneficiaire: string, 
      id:string,montant:number,
      datePrevue: Date, 
      dateEnregistrement: Date, 
      statut: string
    ) {
      super(id,montant, datePrevue, dateEnregistrement, statut);
      this.categorie = categorie;
      this.beneficiaire = beneficiaire;
    }
  
    valider(): void {
      
    }
  
    voter(): void {
      
    }
  }
  