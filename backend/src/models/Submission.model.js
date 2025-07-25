// src/models/Submission.model.js
import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const submissionSchema = new Schema(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        employeeName: {
            type: String,
            required: true
        },
        groupName: {
            type: String,
            required: true
        },
        networkName: {
            type: String,
            required: true
        },
        deviceType: {
            type: String,
            required: true
        },
        formType: {
            type: String,
            required: true,
            enum: ['safety', 'quality', 'environment', 'training', 'feedback', 'performance', 'innovation', 'wellness', 'communication']
        },
        responses: {
            type: Map,
            of: {
                response: {
                    type: String,
                    enum: ['Yes', 'No'],
                    required: true
                },
                remark: {
                    type: String,
                    default: ""
                }
            }
        },
        statusGroupHead: {
            type: String,
            enum: ['pending', 'approved', 'not approved'],
            default: 'pending'
        },
        statusCoordinator: {
            type: String,
            enum: ['pending', 'approved', 'not approved'],
            default: 'pending'
        },
        submissionDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

submissionSchema.plugin(mongooseAggregatePaginate);

export const Submission = mongoose.model("Submission", submissionSchema);
