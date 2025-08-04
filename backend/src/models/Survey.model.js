// src/models/Survey.model.js
import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const surveySchema = new Schema(
    {
        formType: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
        },
        questions: [{
            id: {
                type: Number,
                required: true
            },
            question: {
                type: String,
                required: true
            }
        }],
        isActive: {
            type: Boolean,
            default: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

surveySchema.plugin(mongooseAggregatePaginate);

export const Survey = mongoose.model("Survey", surveySchema);
