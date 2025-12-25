import { Property } from "../domain/entities/property";
import { PropertyEntity } from "../infrastructure/persistence/entities/propertyEntity";

interface PropertyFactoryParams {
	id?: string;
	title?: string;
	description?: string;
	maxGuests?: number;
	basePricePerNight?: number;
}

interface PropertyFactoryOptions extends PropertyFactoryParams {
	/**
	 * If true, provides test defaults for missing fields.
	 * If false, throws validation errors for missing required fields.
	 * @default false
	 */
	isTesting?: boolean;
}

/**
 * Factory for creating Property domain entities.
 *
 * @param options - Configuration for property creation
 * @param options.isTesting - If true, uses test defaults for missing fields
 *
 * @example
 * // In production code (requires all fields)
 * const property = createProperty({
 *   id: uuidv4(),
 *   title: dto.title,
 *   description: dto.description,
 *   maxGuests: dto.maxGuests,
 *   basePricePerNight: dto.pricePerNight,
 * });
 *
 * @example
 * // In tests (provides defaults)
 * const property = createProperty({ isTesting: true });
 * const customProperty = createProperty({
 *   isTesting: true,
 *   title: "Custom Title",
 * });
 */
export const createProperty = (
	options: PropertyFactoryOptions = {},
): Property => {
	const { isTesting = false, ...params } = options;

	// In testing mode, provide defaults
	if (isTesting) {
		return new Property(
			params.id ?? "test-property-id",
			params.title ?? "Test Property",
			params.description ?? "Test Description",
			params.maxGuests ?? 10,
			params.basePricePerNight ?? 100,
		);
	}

	// In production mode, require all fields
	// Property constructor will validate and throw appropriate errors
	return new Property(
		params.id ?? "",
		params.title ?? "",
		params.description ?? "",
		params.maxGuests ?? 0,
		params.basePricePerNight ?? 0,
	);
};

/**
 * Convenience function for creating test properties.
 * Alias for createProperty({ isTesting: true, ...overrides })
 *
 * @param overrides - Optional values to override test defaults
 */
export const createPropertyForTest = (
	overrides?: PropertyFactoryParams,
): Property => {
	return createProperty({ isTesting: true, ...overrides });
};

export const createPropertyPersistenceObject = (
	overrides?: Partial<{
		id: string;
		title: string;
		description: string;
		maxGuests: number;
		basePrice: number;
	}>,
): PropertyEntity => {
	const propertyEntity = new PropertyEntity();
	propertyEntity.id = overrides?.id ?? "test-property-id";
	propertyEntity.title = overrides?.title ?? "Test Property";
	propertyEntity.description = overrides?.description ?? "Test Description";
	propertyEntity.maxGuests = overrides?.maxGuests ?? 10;
	propertyEntity.basePrice = overrides?.basePrice ?? 100;
	return propertyEntity;
};
