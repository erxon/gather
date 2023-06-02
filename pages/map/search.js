import { AddressAutofill } from "@mapbox/search-js-react";

export default function Search() {
  return (
    <>
      <form>
        <AddressAutofill
          accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        >
          <input
            name="address"
            placeholder="Address"
            type="text"
            autoComplete="address-line1"
          />
        </AddressAutofill>
        <input
          name="unit"
          placeholder="Unit number"
          type="text"
          autoComplete="address-line2"
        />
        <input
          name="city"
          placeholder="City"
          type="text"
          autoComplete="address-level2"
        />
        <input
          name="state"
          placeholder="State"
          type="text"
          autoComplete="address-level1"
        />
        <input
          name="country"
          placeholder="Country"
          type="text"
          autoComplete="country"
        />

        <input
          name="postcode"
          placeholder="Postcode"
          type="text"
          autoComplete="postal-code"
        />
      </form>
    </>
  );
}
