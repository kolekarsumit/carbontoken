// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract CarbonContract {
    address myaddress = msg.sender;

    struct Company {
        string name;
        string industry_type;
        uint256 gov_id;
        string comp_address;
        address Address;
        uint256 allocatedcarbon;
        uint256 remaining;
    }

    mapping(address => Company) private companies;
    address[] public companyAddresses;
    mapping(uint256 => bool) private govIdExists;
    mapping(uint256 => address) private govIdToAddress; 
    
    // Mapping to store year-month data for each company
    mapping(address => mapping(uint256 => uint256)) private yearMonthData; // company address -> yearMonth -> value
    mapping(address => uint256[]) private companyYearMonths; // store year-month keys for each company

    // Add a company
    function add_company(
        string memory _name,
        string memory _industry,
        uint256 _gov_add,
        string memory _comp_add
    ) public payable {
        require(
            bytes(companies[msg.sender].name).length == 0,
            "Address Already registered"
        );
        require(
            !govIdExists[_gov_add],
            "GOV ID already corresponds to another company"
        );

        companyAddresses.push(msg.sender);
        govIdExists[_gov_add] = true;
        govIdToAddress[_gov_add] = msg.sender; 
        companies[msg.sender] = Company(_name, _industry, _gov_add, _comp_add, msg.sender, 1000, 1000);
    }

    // Get all companies
    function getAllCompany() public view returns (Company[] memory) {
        Company[] memory allcomp = new Company[](companyAddresses.length);

        for (uint256 i = 0; i < companyAddresses.length; i++) {
            address ad = companyAddresses[i];
            Company storage cmp = companies[ad];
            allcomp[i] = cmp;
        }
        return allcomp;
    }

    // Get my company using GOV ID
    function getmycompany(string memory _address) public view returns (Company memory) {
        address companyAddress = parseAddress(_address);
        require(companyAddress != address(0), "Company not found for this GOV ID");

        return companies[companyAddress];
    }

    // Remove a company
    function remove_company(uint256 _gov_id) public {
        address companyAddress = govIdToAddress[_gov_id];
        require(companyAddress != address(0), "Company not found");

        require(msg.sender == companyAddress, "Only the company owner can remove it");

        govIdExists[_gov_id] = false;
        delete govIdToAddress[_gov_id];

        delete companies[companyAddress];

        for (uint256 i = 0; i < companyAddresses.length; i++) {
            if (companyAddresses[i] == companyAddress) {
                companyAddresses[i] = companyAddresses[companyAddresses.length - 1]; 
                companyAddresses.pop(); 
                break;
            }
        }
    }

    // Validate GOV ID against an address
    function validateGovId(uint256 _govId, string memory stringaddress) public view returns (bool) {
        address companyAddress = govIdToAddress[_govId];
        address converted_address=parseAddress(stringaddress);
        return companyAddress == converted_address;
    }

    function parseAddress(string memory _stringAddress) internal pure returns (address) {
        bytes memory addrBytes = bytes(_stringAddress);
        require(addrBytes.length == 42, "Invalid address length"); // Ensure the string is 42 chars long (0x + 40 hex)
        require(addrBytes[0] == '0' && addrBytes[1] == 'x', "Address must start with 0x"); // Ensure it starts with 0x

        uint160 addr = 0;
        for (uint256 i = 2; i < 42; i++) {
            uint160 char = uint160(uint8(addrBytes[i]));

            if (char >= 48 && char <= 57) {
                // 0-9
                addr = addr * 16 + (char - 48);
            } else if (char >= 65 && char <= 70) {
                // A-F
                addr = addr * 16 + (char - 55);
            } else if (char >= 97 && char <= 102) {
                // a-f
                addr = addr * 16 + (char - 87);
            } else {
                revert("Invalid character in address");
            }
        }
        return address(addr);
    }

    // Return the contract's address (myaddress)
    function mycomp() public view returns(address) {
        return myaddress;
    }

    // Store year-month data for a company (prevents duplicates)
    function storeYearMonthData(string memory _address, uint256 _yearMonth, uint256 _value) public {
           address companyAddress = parseAddress(_address);
        require(companyAddress != address(0), "Company not registered for this GOV ID");

        // Check if the year-month already exists for the company
        require(yearMonthData[companyAddress][_yearMonth] == 0, "Year-month data already exists");

        // Subtract the value from the company's remaining carbon
        require(companies[companyAddress].remaining >= _value, "Insufficient remaining carbon");
        companies[companyAddress].remaining -= _value;

        // Store the year-month data
        yearMonthData[companyAddress][_yearMonth] = _value;
        companyYearMonths[companyAddress].push(_yearMonth);
    }

    // Retrieve all year-month data for a company using GOV ID
    function getYearMonthData(string memory _address) public view returns (uint256[] memory, uint256[] memory) {
        address companyAddress = parseAddress(_address);
        require(companyAddress != address(0), "Company not registered for this GOV ID");

        uint256 totalEntries = companyYearMonths[companyAddress].length;
        uint256[] memory yearMonths = new uint256[](totalEntries);
        uint256[] memory values = new uint256[](totalEntries);

        for (uint256 i = 0; i < totalEntries; i++) {
            uint256 yearMonth = companyYearMonths[companyAddress][i];
            yearMonths[i] = yearMonth;
            values[i] = yearMonthData[companyAddress][yearMonth];
        }

        return (yearMonths, values);
    }

    // Retrieve the remaining carbon for a company using GOV ID
    function getRemainingCarbon(string memory _address) public view returns (uint256) {
        address companyAddress = parseAddress(_address);
        require(companyAddress != address(0), "Company not registered for this GOV ID");

        return companies[companyAddress].remaining;
    }
    function getAllocatedCarbon(string memory _address) public view returns (uint256) {
         address companyAddress = parseAddress(_address);
        require(companyAddress != address(0), "Company not registered for this GOV ID");

        return companies[companyAddress].allocatedcarbon;
    }
}
