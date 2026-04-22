import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getEngagementData from '@salesforce/apex/EngagementSummaryController.getEngagementData';
import createFollowUpCall from '@salesforce/apex/EngagementSummaryController.createFollowUpCall';

export default class EngagementSummary extends LightningElement {
    @api recordId;
    
    opportunityAmount = 'N/A';
    completedTasks = 0;
    upcomingEvents = 0;
    engagementName = '';
    message = '';

    @wire(getEngagementData, { recordId: '$recordId' })
    wiredData({ error, data }) {
        if (data) {
            this.opportunityAmount = data.opportunityAmount 
                ? '$' + data.opportunityAmount 
                : 'N/A';
            this.completedTasks = data.completedTasks;
            this.upcomingEvents = data.upcomingEvents;
            this.engagementName = data.engagementName;
        } else if (error) {
            console.error('Error loading engagement data:', error);
        }
    }

    handleFollowUpCall() {
        createFollowUpCall({ 
            recordId: this.recordId, 
            engagementName: this.engagementName 
        })
        .then(() => {
            this.message = 'Follow-up call created successfully!';
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Follow-up call task created!',
                variant: 'success'
            }));
        })
        .catch(error => {
            console.error('Error creating task:', error);
            this.message = 'Error creating follow-up call.';
        });
    }
}