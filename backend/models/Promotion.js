import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		discountType: {
			type: String,
			enum: ["percentage", "fixed"],
			required: true,
		},
		discountValue: {
			type: Number,
			required: true,
			min: 0,
		},
		minOrderAmount: {
			type: Number,
			default: 0,
			min: 0,
		},
		maxDiscount: {
			type: Number,
			default: null,
			min: 0,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		usageLimit: {
			type: Number,
			default: null,
			min: 0,
		},
		usageCount: {
			type: Number,
			default: 0,
			min: 0,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true },
);

promotionSchema.pre("validate", function (next) {
	if (this.discountType === "percentage" && this.discountValue > 100) {
		return next(new Error("Percentage discount cannot exceed 100"));
	}

	if (this.endDate < this.startDate) {
		return next(new Error("Promotion end date must be after start date"));
	}

	next();
});

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;
